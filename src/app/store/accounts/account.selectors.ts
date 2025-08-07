import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAccountState } from '../../core/interfaces/account.interface';

const KEY_NAME = 'account';

const selectAccountState = createFeatureSelector<IAccountState>(KEY_NAME);

export const selectAccounts = createSelector(
  selectAccountState,
  (state) => state.accounts
);

export const selectAccountsLoading = createSelector(
  selectAccountState,
  (state) => state.loading
);
export const selectAccountError = createSelector(
  selectAccountState,
  (state) => state.error
);
