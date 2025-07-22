import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  throwError,
  BehaviorSubject,
  filter,
  take,
  switchMap,
  catchError,
} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth/auth.actions';
import { AuthState } from '../../store/auth/auth.models';
import { selectUser } from '../../store/auth/auth.selectors';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthService,
    private store: Store<{ auth: AuthState }>
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authReq = req.clone({ withCredentials: true });

    console.log('➡️ Sending request to:', req.url);

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('⛔️ HTTP Error:', error.status, req.url);

        if (error.status === 401) {
          // ❌ Bỏ qua login / logout route không cần refresh
          const skipRefreshUrls = ['/auth/login', '/auth/logout'];
          if (skipRefreshUrls.some((url) => req.url.includes(url))) {
            console.warn('🚫 Skipping refresh for:', req.url);
            return throwError(() => error);
          }

          console.warn('🔐 401 detected — Checking refresh flow...');
          return this.store.select('auth').pipe(
            take(1),
            switchMap((authState) => {
              const user = authState.user;

              console.log('👤 User from store:', user);

              if (!user) {
                console.warn('🚫 No user → Skip refresh');
                return throwError(() => error);
              }

              return this.handle401Error(authReq, next);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      console.log('🔄 Start refresh token');
      this.isRefreshing = true;
      this.refreshTokenSubject.next(false);

      return this.authService.refreshToken().pipe(
        switchMap((res) => {
          this.isRefreshing = false;

          if (res.success) {
            console.log('✅ Refresh success → Update store & retry request');
            this.store.dispatch(
              AuthActions.refreshTokenSuccess({ user: res.data })
            );
            this.refreshTokenSubject.next(true);

            return next.handle(request);
          } else {
            console.warn('❌ Refresh failed → Dispatch logout');
            this.store.dispatch(AuthActions.refreshTokenFailure());
            return throwError(() => new Error('Refresh failed'));
          }
        }),
        catchError((err) => {
          this.isRefreshing = false;
          console.error('❌ Refresh error:', err.message);
          this.store.dispatch(AuthActions.refreshTokenFailure());
          return throwError(() => err);
        })
      );
    } else {
      console.log('⏳ Waiting for ongoing refresh to finish...');
      return this.refreshTokenSubject.pipe(
        filter((ready) => ready === true),
        take(1),
        switchMap(() => {
          console.log('🔁 Retry after refresh done:', request.url);
          return next.handle(request);
        })
      );
    }
  }
}
