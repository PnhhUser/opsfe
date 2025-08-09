import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IPermissionState } from '../../core/interfaces/permission.interface';

const KEY_NAME = 'permission';

const selectPermissionState = createFeatureSelector<IPermissionState>(KEY_NAME);

export const selectPermission = createSelector(
  selectPermissionState,
  (state) => state.permissions
);

export const selectPermissionLoading = createSelector(
  selectPermissionState,
  (state) => state.loading
);
export const selectPermissionError = createSelector(
  selectPermissionState,
  (state) => state.error
);
