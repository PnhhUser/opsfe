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
  })),

  // edit
  on(AccountAction.editAccount, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AccountAction.editAccountSuccess, (state, { account }) => {
    return {
      ...state,
      accounts: state.accounts.map((a) =>
        a.accountId === account.accountId ? account : a
      ),
      loading: false,
    };
  }),
  on(AccountAction.editAccountFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // remove
  on(AccountAction.removeAccount, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AccountAction.removeAccountSuccess, (state, { accountId }) => ({
    ...state,
    accounts: state.accounts.filter((a) => a.accountId !== accountId),
    loading: false,
  })),

  on(AccountAction.removeAccountFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // reset error
  on(AccountAction.resetAccountError, (state) => ({
    ...state,
    error: null, // Reset error về null
  }))
);
