import { createReducer, on } from '@ngrx/store';
import { IDepartmentState } from '../../core/interfaces/department.interface';
import { ActionDepartment } from './department.actions';

const initialDepartment: IDepartmentState = {
  departments: [],
  loading: false,
  error: null,
};

export const departmentReducer = createReducer(
  initialDepartment,
  // load
  on(ActionDepartment.loadDepartments, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ActionDepartment.loadDepartmentsSuccess, (state, { departments }) => ({
    ...state,
    departments,
    loading: false,
  })),
  on(ActionDepartment.loadDepartmentsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // add
  on(ActionDepartment.AddDeparment, (state) => {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),
  on(ActionDepartment.AddDepartmentSuccess, (state, { department }) => {
    return {
      ...state,
      loading: false,
      departments: [...state.departments, department],
    };
  }),
  on(ActionDepartment.AddDepartmentFailure, (state, { error }) => {
    return {
      ...state,
      loading: false,
      error,
    };
  })
);
