import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IRoleState } from '../../core/interfaces/role.interface';

const KEY_NAME = 'role';

const selectState = createFeatureSelector<IRoleState>(KEY_NAME);

export const selectRoles = createSelector(selectState, (state) => state.roles);

export const selectRolesLoading = createSelector(
  selectState,
  (state) => state.loading
);
export const selectRolesError = createSelector(
  selectState,
  (state) => state.error
);
