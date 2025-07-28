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
import { IAuthState } from '../interfaces/auth.interface';
import { EMPTY } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthService,
    private store: Store<{ auth: IAuthState }>
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authReq = req.clone({ withCredentials: true });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Nếu lỗi từ /auth/refresh → không log, không xử lý tiếp
        if (error.status === 401 && req.url.includes('/auth/refresh')) {
          return EMPTY; // 🚫 không ném lỗi nữa
        }

        // 401 và không phải refresh → xử lý refresh
        if (error.status === 401 && !this.shouldSkipRefresh(req.url)) {
          return this.handle401Error(authReq, next);
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
      this.isRefreshing = true;
      this.refreshTokenSubject.next(false);

      return this.authService.refreshToken().pipe(
        switchMap((res) => {
          this.isRefreshing = false;

          if (res.success) {
            // Optional: Cập nhật user nếu BE trả về
            if (res.data) {
              this.store.dispatch(
                AuthActions.refreshTokenSuccess({ user: res.data })
              );
            }

            this.refreshTokenSubject.next(true);
            return next.handle(request);
          } else {
            this.store.dispatch(AuthActions.refreshTokenFailure());
            return throwError(() => new Error('Refresh failed'));
          }
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.store.dispatch(AuthActions.refreshTokenFailure());
          return throwError(() => err);
        })
      );
    } else {
      // ⏳ Đợi refresh đang chạy xong rồi retry
      return this.refreshTokenSubject.pipe(
        filter((ready) => ready === true),
        take(1),
        switchMap(() => next.handle(request))
      );
    }
  }

  private shouldSkipRefresh(url: string): boolean {
    const skipUrls = ['/auth/login', '/auth/logout', '/auth/refresh'];
    return skipUrls.some((skip) => url.includes(skip));
  }
}
