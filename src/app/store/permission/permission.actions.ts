import { createAction, props } from '@ngrx/store';
import {
  ILoadPermissions,
  IPermission,
  IUpdatePermission,
} from '../../core/interfaces/permission.interface';
import { IError } from '../../core/interfaces/error.interface';

// Load
const loadPermissions = createAction('[Permission] Load Permission');

const loadPermissionSuccess = createAction(
  '[Permission] Load Permission Success',
  props<{ permissions: ILoadPermissions[] }>()
);

const loadPermissionFailure = createAction(
  '[Permission] Load Permissions Failure',
  props<{ error: IError }>()
);

// Add
const addPermission = createAction(
  '[Permission] Add Permission',
  props<{ permission: IPermission }>()
);

const addPermissionSuccess = createAction(
  '[Permission] Add Permission Success',
  props<{ permission: ILoadPermissions }>()
);

const addPermissionFailure = createAction(
  '[Permission] Add Permission Failure',
  props<{ error: IError }>()
);

// edit
const editPermission = createAction(
  '[Permission] Edit Permission',
  props<{ permission: IUpdatePermission }>()
);

const editPermissionSuccess = createAction(
  '[Permission] Edit Permission Success',
  props<{ permission: ILoadPermissions }>()
);

const editPermissionFailure = createAction(
  '[Permission] Edit Permission Failure',
  props<{ error: IError }>()
);

// remove
const removePermission = createAction(
  '[Permission] Remove Permission',
  props<{ permissionId: number }>()
);

const removePermissionSuccess = createAction(
  '[Permission] Remove Permission Success',
  props<{ permissionId: number }>()
);

const removePermissionFailure = createAction(
  '[Permission] Remove Permission Failure',
  props<{ error: IError }>()
);

export const ActionPermission = {
  loadPermissions,
  loadPermissionSuccess,
  loadPermissionFailure,

  addPermission,
  addPermissionSuccess,
  addPermissionFailure,

  editPermission,
  editPermissionSuccess,
  editPermissionFailure,

  removePermission,
  removePermissionSuccess,
  removePermissionFailure,
};
