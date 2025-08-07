import { createAction, props } from '@ngrx/store';

import { IError } from '../../core/interfaces/error.interface';
import {
  IEmployee,
  ILoadEmployee,
  IUpdateEmployee,
} from '../../core/interfaces/employee.interface';

// Load
const loadEmployees = createAction('[Employee] Load Employees');

const loadEmployeeSuccess = createAction(
  '[Employee] Load Employees Success',
  props<{ employees: ILoadEmployee[] }>()
);

const loadEmployeesFailure = createAction(
  '[Employee] Load Employees Failure',
  props<{ error: IError }>()
);

// Add
const addEmployee = createAction(
  '[Employee] Add Employee',
  props<{ employee: IEmployee }>()
);

const addEmployeeSuccess = createAction(
  '[Employee] Add Employee Success',
  props<{ employee: ILoadEmployee }>()
);

const addEmployeeFailure = createAction(
  '[Employee] Add Employee Failure',
  props<{ error: IError }>()
);

// edit
const editEmployee = createAction(
  '[Employee] Edit Employee',
  props<{ employee: IUpdateEmployee }>()
);

const editEmployeeSuccess = createAction(
  '[Employee] Edit Employee Success',
  props<{ employee: ILoadEmployee }>()
);

const editEmployeeFailure = createAction(
  '[Employee] Edit Employee Failure',
  props<{ error: IError }>()
);

const removeEmployee = createAction(
  '[Employee] Remove Employee',
  props<{ employeeId: number }>()
);

const removeEmployeeSuccess = createAction(
  '[Employee] Remove Employee Success',
  props<{ employeeId: number }>()
);

const removeEmployeeFailure = createAction(
  '[Employee] Remove Employee Failure',
  props<{ error: IError }>()
);

export const ActionEmployee = {
  loadEmployees,
  loadEmployeeSuccess,
  loadEmployeesFailure,

  addEmployee,
  addEmployeeSuccess,
  addEmployeeFailure,

  editEmployee,
  editEmployeeSuccess,
  editEmployeeFailure,

  removeEmployee,
  removeEmployeeSuccess,
  removeEmployeeFailure,
};
