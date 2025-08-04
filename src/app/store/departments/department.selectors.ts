import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IDepartmentState } from '../../core/interfaces/department.interface';

const KEY_NAME = 'department';

const selectDepartmentState = createFeatureSelector<IDepartmentState>(KEY_NAME);

export const selectDepartments = createSelector(
  selectDepartmentState,
  (state) => state.departments
);

export const selectDepartmentLoading = createSelector(
  selectDepartmentState,
  (state) => state.loading
);
export const selecDepartmentError = createSelector(
  selectDepartmentState,
  (state) => state.error
);
