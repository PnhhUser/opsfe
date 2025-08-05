import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AccountService } from '../../core/services/account.service';
import { Router } from '@angular/router';
import * as AccountAction from './account.actions';
import { catchError, exhaustMap, map, mergeMap, of } from 'rxjs';
import { ILoadAccount } from '../../core/interfaces/account.interface';

@Injectable()
export class AccountEffect {
  loadAccount$;
  addAccount$;
  editAccount$;
  removeAccount$;

  constructor(
    protected accountService: AccountService,
    protected actions$: Actions,
    protected router: Router
  ) {
    this.loadAccount$ = createEffect(() => this.configLoadAccount());
    this.addAccount$ = createEffect(() => this.configAddAccount());
    this.editAccount$ = createEffect(() => this.configEditAccount());
    this.removeAccount$ = createEffect(() => this.configRemoveAccount());
  }

  configLoadAccount() {
    return this.actions$.pipe(
      ofType(AccountAction.loadAccount),
      mergeMap(() => {
        return this.accountService.getAccounts().pipe(
          map((accountsResponse) => {
            return AccountAction.loadAccountSuccess({
              accounts: accountsResponse.data,
            });
          })
        );
      })
    );
  }

  configAddAccount() {
    return this.actions$.pipe(
      ofType(AccountAction.addAccount),
      exhaustMap(({ account }) => {
        return this.accountService.addAccount(account).pipe(
          map((response) => {
            const {
              accountId,
              username,
              lastseen,
              createdAt,
              updatedAt,
              isActive: isAction,
              roleId: role,
            } = response.data;

            const created: ILoadAccount = {
              accountId,
              username,
              lastseen,
              isActive: isAction,
              roleId: role,
              createdAt,
              updatedAt,
            };

            return AccountAction.addAccountSuccess({ account: created });
          }),
          catchError((error) =>
            of(
              AccountAction.addAccountFailure({
                error: {
                  message:
                    error?.error?.message ||
                    'Lỗi không xác định khi tạo tài khoản',
                },
              })
            )
          )
        );
      })
    );
  }

  configEditAccount() {
    return this.actions$.pipe(
      ofType(AccountAction.editAccount),
      exhaustMap(({ account }) =>
        this.accountService.updateAccount(account).pipe(
          map((response) => {
            const {
              accountId,
              username,
              lastseen,
              createdAt,
              updatedAt,
              isActive: isAction,
              roleId: role,
            } = response.data;

            const updated: ILoadAccount = {
              accountId,
              username,
              lastseen,
              isActive: isAction,
              roleId: role,
              createdAt,
              updatedAt,
            };
            return AccountAction.editAccountSuccess({ account: updated });
          }),
          catchError((error) =>
            of(
              AccountAction.editAccountFailure({
                error: {
                  message:
                    error?.error?.message ||
                    'Lỗi không xác định khi tạo tài khoản',
                },
              })
            )
          )
        )
      )
    );
  }

  configRemoveAccount() {
    return this.actions$.pipe(
      ofType(AccountAction.removeAccount),
      exhaustMap(({ accountId }) =>
        this.accountService.removeAccount(accountId).pipe(
          map(() => AccountAction.removeAccountSuccess({ accountId })),
          catchError((error) =>
            of(
              AccountAction.removeAccountFailure({
                error: {
                  message:
                    error?.error?.message ||
                    'Lỗi không xác định khi xoá tài khoản',
                },
              })
            )
          )
        )
      )
    );
  }
}
