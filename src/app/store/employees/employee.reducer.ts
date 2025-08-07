import { createReducer, on } from '@ngrx/store';
import { IEmployeeState } from '../../core/interfaces/employee.interface';
import { ActionEmployee } from './employee.actions';

const initialEmployee: IEmployeeState = {
  employees: [],
  loading: false,
  error: null,
};

export const employeeReducer = createReducer(
  initialEmployee,
  // load
  on(ActionEmployee.loadEmployees, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ActionEmployee.loadEmployeeSuccess, (state, { employees }) => ({
    ...state,
    employees,
    loading: false,
  })),
  on(ActionEmployee.loadEmployeesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // add
  on(ActionEmployee.addEmployee, (state) => {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),
  on(ActionEmployee.addEmployeeSuccess, (state, { employee }) => {
    return {
      ...state,
      loading: false,
      employees: [...state.employees, employee],
    };
  }),
  on(ActionEmployee.addEmployeeFailure, (state, { error }) => {
    return {
      ...state,
      loading: false,
      error,
    };
  }),

  // edit
  on(ActionEmployee.editEmployee, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ActionEmployee.editEmployeeSuccess, (state, { employee }) => ({
    ...state,
    loading: false,
    employees: state.employees.map((d) =>
      d.employeeId === employee.employeeId ? employee : d
    ),
  })),
  on(ActionEmployee.editEmployeeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // remove
  on(ActionEmployee.removeEmployee, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ActionEmployee.removeEmployeeSuccess, (state, { employeeId }) => ({
    ...state,
    employees: state.employees.filter((d) => d.employeeId !== employeeId),
    loading: false,
  })),

  on(ActionEmployee.removeEmployeeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
