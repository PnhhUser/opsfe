import { IAccount } from './../../core/interfaces/account.interface';
import { createReducer, on } from '@ngrx/store';
import { IAccountState } from '../../core/interfaces/account.interface';
import * as AccountAction from './account.actions';

const initialAccount: IAccountState = {
  accounts: [],
  loading: false,
  error: null,
};

export const accountReducer = createReducer(
  initialAccount,

  // load
  on(AccountAction.loadAccount, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AccountAction.loadAccountSuccess, (state, { accounts }) => ({
    ...state,
    accounts,
    loading: false,
  })),
  on(AccountAction.loadAccountFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // add
  on(AccountAction.addAccount, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AccountAction.addAccountSuccess, (state, { account }) => {
    return {
      ...state,
      accounts: [...state.accounts, account],
      loading: false,
    };
  }),
  on(AccountAction.addAccountFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
