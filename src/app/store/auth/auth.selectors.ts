import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAuthState } from '../../core/interfaces/auth.interface';

const KEY_NAME = 'auth';

const selectAuthState = createFeatureSelector<IAuthState>(KEY_NAME);

export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);
export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);
export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);
