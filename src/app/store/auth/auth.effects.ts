import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth.service';
import * as AuthActions from './auth.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class AuthEffects {
  login$: any;
  checkAuth$: any;
  logout$: any;
  refreshToken$: any;

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {
    // 🔐 LOGIN
    this.login$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        mergeMap(({ username, password }) =>
          this.authService.login({ username, password }).pipe(
            map((response) => {
              if (response.success) {
                localStorage.setItem('hasLogin', JSON.stringify(true));
                this.router.navigate(['/']).then(() => {
                  location.reload();
                });
                return AuthActions.loginSuccess({
                  user: response.data,
                });
              } else {
                return AuthActions.loginFailure({
                  error: { message: response.message || 'Login failed' },
                });
              }
            }),
            catchError((error) => {
              let message: string;

              if (error.status === 0) {
                // Server không phản hồi (không bật / mất mạng / CORS)
                message =
                  'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại.';
              } else {
                message =
                  typeof error.error === 'string'
                    ? error.error
                    : error.error?.message || error.message || 'Unknown error';
              }
              return of(
                AuthActions.loginFailure({
                  error: {
                    message: message,
                    source: 'manual',
                  },
                })
              );
            })
          )
        )
      )
    );

    // CHECK AUTH (chỉ nên gọi khi biết chắc cookie còn)
    this.checkAuth$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.checkAuth),
        mergeMap(() =>
          this.authService.checkAuth().pipe(
            map((res) => {
              return res.success
                ? AuthActions.loginSuccess({ user: res.data })
                : AuthActions.loginFailure({
                    error: { message: res.message || 'Chưa xác thực.' },
                  });
            }),
            catchError((error) => {
              let message: string;

              if (error.status === 0) {
                // Server không phản hồi (không bật / mất mạng / CORS)
                message =
                  'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại.';
              } else {
                message =
                  typeof error.error === 'string'
                    ? error.error
                    : error.error?.message || error.message || 'Unknown error';
              }
              return of(
                AuthActions.loginFailure({
                  error: {
                    message: message ? 'Bạn cần đăng nhập' : 'Unknown error',
                    source: 'checkAuth',
                  },
                })
              );
            })
          )
        )
      )
    );

    // LOGOUT
    this.logout$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        mergeMap(() =>
          this.authService.logout().pipe(
            map(() => {
              localStorage.removeItem('hasLogin');
              this.router.navigate(['/login']).then(() => {
                localStorage.removeItem('roleSetup');
                location.reload();
              });
              return AuthActions.logoutSuccess();
            }),
            catchError((error) => {
              let message: string;

              if (error.status === 0) {
                // Server không phản hồi (không bật / mất mạng / CORS)
                message =
                  'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại.';
              } else {
                message =
                  typeof error.error === 'string'
                    ? error.error
                    : error.error?.message || error.message || 'Unknown error';
              }
              return of(
                AuthActions.logoutFailure({
                  error: {
                    message: message || 'Unknown error',
                  },
                })
              );
            })
          )
        )
      )
    );

    // REFRESH TOKEN
    this.refreshToken$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.refreshToken),
        mergeMap(() =>
          this.authService.refreshToken().pipe(
            map((res) =>
              res.success
                ? AuthActions.refreshTokenSuccess({ user: res.data })
                : AuthActions.refreshTokenFailure()
            ),
            catchError(() => of(AuthActions.refreshTokenFailure()))
          )
        )
      )
    );
  }
}
