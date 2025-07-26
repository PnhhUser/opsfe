import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AccountService } from '../../core/services/account.service';
import { Router } from '@angular/router';
import * as AccountAction from './account.actions';
import { catchError, exhaustMap, map, mergeMap, of } from 'rxjs';
import { AccountModel } from '../../core/models/account.model';
import { ILoadAccount } from '../../core/interfaces/account.interface';

@Injectable()
export class AccountEffect {
  loadAccount$;
  addAccount$;
  constructor(
    protected accountService: AccountService,
    protected actions$: Actions,
    protected router: Router
  ) {
    this.loadAccount$ = createEffect(() => this.configLoadAccount());
    this.addAccount$ = createEffect(() => this.configAddAccount());
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
              isAction,
              roleId,
            } = response.data;

            const account: ILoadAccount = {
              accountId,
              username,
              lastseen,
              isAction,
              roleId,
              createdAt,
              updatedAt,
            };

            return AccountAction.addAccountSuccess({ account });
          }),
          catchError((error) => of(AccountAction.addAccountFailure({ error })))
        );
      })
    );
  }
}
