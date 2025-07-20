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
  catchError,
  switchMap,
  throwError,
  BehaviorSubject,
  filter,
  take,
  of,
} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth/auth.actions';
import { AuthState } from '../../store/auth/auth.models';

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
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.store.select('auth').pipe(
            take(1),
            switchMap((authState) => {
              const user = authState.user;

              if (!user) {
                // ❌ Chưa đăng nhập => Không refresh
                return throwError(() => error);
              }

              if (!this.isRefreshing) {
                // ✅ Bắt đầu refresh
                this.isRefreshing = true;
                this.refreshTokenSubject.next(false);

                return this.authService.refreshToken().pipe(
                  switchMap((res) => {
                    this.isRefreshing = false;

                    if (res.success) {
                      this.store.dispatch(
                        AuthActions.refreshTokenSuccess({ user: res.data })
                      );
                      this.refreshTokenSubject.next(true);
                      return next.handle(req); // ✅ retry request
                    } else {
                      this.store.dispatch(AuthActions.refreshTokenFailure());
                      return throwError(() => error);
                    }
                  }),
                  catchError((err) => {
                    this.isRefreshing = false;
                    this.store.dispatch(AuthActions.refreshTokenFailure());
                    return throwError(() => err);
                  })
                );
              } else {
                // ⏳ Nếu đang refresh, đợi refreshTokenSubject xong rồi retry
                return this.refreshTokenSubject.pipe(
                  filter((ready) => ready === true),
                  take(1),
                  switchMap(() => next.handle(req))
                );
              }
            })
          );
        }

        // Các lỗi khác
        return throwError(() => error);
      })
    );
  }
}
