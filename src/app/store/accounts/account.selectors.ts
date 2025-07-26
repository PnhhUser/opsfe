import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAccountState } from '../../core/interfaces/account.interface';

const KEY_NAME = 'account';

const selectAccountState = createFeatureSelector<IAccountState>(KEY_NAME);

export const selectAccounts = createSelector(
  selectAccountState,
  (state) => state.accounts
);

export const selectLoading = createSelector(
  selectAccountState,
  (state) => state.loading
);
export const selectError = createSelector(
  selectAccountState,
  (state) => state.error
);
