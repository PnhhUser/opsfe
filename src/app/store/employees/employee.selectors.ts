import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IEmployeeState } from '../../core/interfaces/employee.interface';

const KEY_NAME = 'employee';

const selectEmpState = createFeatureSelector<IEmployeeState>(KEY_NAME);

export const selectEmps = createSelector(
  selectEmpState,
  (state) => state.employees
);

export const selectEmpLoading = createSelector(
  selectEmpState,
  (state) => state.loading
);
export const selectEmpError = createSelector(
  selectEmpState,
  (state) => state.error
);
