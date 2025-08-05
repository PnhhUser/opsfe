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
  on(ActionDepartment.addDeparment, (state) => {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),
  on(ActionDepartment.addDepartmentSuccess, (state, { department }) => {
    return {
      ...state,
      loading: false,
      departments: [...state.departments, department],
    };
  }),
  on(ActionDepartment.addDepartmentFailure, (state, { error }) => {
    return {
      ...state,
      loading: false,
      error,
    };
  }),

  // edit
  on(ActionDepartment.editDepartment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ActionDepartment.editDepartmentSuccess, (state, { department }) => ({
    ...state,
    loading: false,
    departments: state.departments.map((d) =>
      d.departmentId === department.departmentId ? department : d
    ),
  })),
  on(ActionDepartment.editDepartmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // remove
  on(ActionDepartment.removeDepartment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ActionDepartment.removeDepartmentSuccess, (state, { departmentId }) => ({
    ...state,
    departments: state.departments.filter(
      (d) => d.departmentId !== departmentId
    ),
    loading: false,
  })),

  on(ActionDepartment.removeDepartmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
