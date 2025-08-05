import { createAction, props } from '@ngrx/store';
import {
  IDepartment,
  IloadDepartment,
  IUpdateDepertment,
} from '../../core/interfaces/department.interface';
import { IError } from '../../core/interfaces/error.interface';

// Load
const loadDepartments = createAction('[Department] Load Departments');

const loadDepartmentsSuccess = createAction(
  '[Department] Load Departments Success',
  props<{ departments: IloadDepartment[] }>()
);

const loadDepartmentsFailure = createAction(
  '[Department] Load Departments Failure',
  props<{ error: IError }>()
);

// Add
const addDeparment = createAction(
  '[Department] Add Department',
  props<{ department: IDepartment }>()
);

const addDepartmentSuccess = createAction(
  '[Department] Add Department Success',
  props<{ department: IloadDepartment }>()
);

const addDepartmentFailure = createAction(
  '[Department] Add Department Failure',
  props<{ error: IError }>()
);

// edit
const editDepartment = createAction(
  '[Department] Edit Department',
  props<{ department: IUpdateDepertment }>()
);

const editDepartmentSuccess = createAction(
  '[Department] Edit Department Success',
  props<{ department: IloadDepartment }>()
);

const editDepartmentFailure = createAction(
  '[Department] Edit Department Failure',
  props<{ error: IError }>()
);

const removeDepartment = createAction(
  '[Department] Remove Department',
  props<{ departmentId: number }>()
);

const removeDepartmentSuccess = createAction(
  '[Department] Remove Department Success',
  props<{ departmentId: number }>()
);

const removeDepartmentFailure = createAction(
  '[Department] Remove Department Failure',
  props<{ error: IError }>()
);

export const ActionDepartment = {
  loadDepartments,
  loadDepartmentsSuccess,
  loadDepartmentsFailure,

  addDeparment,
  addDepartmentSuccess,
  addDepartmentFailure,

  editDepartment,
  editDepartmentSuccess,
  editDepartmentFailure,

  removeDepartment,
  removeDepartmentSuccess,
  removeDepartmentFailure,
};
