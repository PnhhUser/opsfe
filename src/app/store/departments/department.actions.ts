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
const AddDeparment = createAction(
  '[Department] Add Department',
  props<{ department: IDepartment }>()
);

const AddDepartmentSuccess = createAction(
  '[Department] Add Department Success',
  props<{ department: IloadDepartment }>()
);

const AddDepartmentFailure = createAction(
  '[Department] Add Department Failure',
  props<{ error: IError }>()
);

// edit
const EditDepartment = createAction(
  '[Department] Edit Department',
  props<{ department: IUpdateDepertment }>
);

const EditDepartmentSuccess = createAction(
  '[Department] Edit Department Success',
  props<{ department: IloadDepartment }>()
);

const EditDepartmentFailure = createAction(
  '[Department] Edit Department Failure',
  props<{ error: IError }>()
);

const RemoveDepartment = createAction('[Department] Remove Department');

const RemoveDepartmentSuccess = createAction(
  '[Department] Remove Department Success'
);

const RemoveDepartmentFailure = createAction(
  '[Department] Remove Department Failure',
  props<{ error: IError }>()
);

export const ActionDepartment = {
  loadDepartments,
  loadDepartmentsSuccess,
  loadDepartmentsFailure,

  AddDeparment,
  AddDepartmentSuccess,
  AddDepartmentFailure,

  EditDepartment,
  EditDepartmentSuccess,
  EditDepartmentFailure,

  RemoveDepartment,
  RemoveDepartmentSuccess,
  RemoveDepartmentFailure,
};
