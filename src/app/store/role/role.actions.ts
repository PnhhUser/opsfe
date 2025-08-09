import { createAction, props } from '@ngrx/store';
import { IError } from '../../core/interfaces/error.interface';
import {
  ILoadRoles,
  IRole,
  IUpdateRole,
} from '../../core/interfaces/role.interface';

// Load
const loadRoles = createAction('[Role] Load roles');

const loadRolesSuccess = createAction(
  '[Role] Load Roles Success',
  props<{ roles: ILoadRoles[] }>()
);

const loadRolesFailure = createAction(
  '[Role] Load Roles Failure',
  props<{ error: IError }>()
);

// Add
const addRole = createAction('[Role] Add Role', props<{ role: IRole }>());

const addRoleSuccess = createAction(
  '[Role] Add Role Success',
  props<{ role: ILoadRoles }>()
);

const addRoleFailure = createAction(
  '[Role] Add Role Failure',
  props<{ error: IError }>()
);

// edit
const editRole = createAction(
  '[Role] Edit role',
  props<{ role: IUpdateRole }>()
);

const editRoleSuccess = createAction(
  '[Role] Edit Role Success',
  props<{ role: ILoadRoles }>()
);

const editRoleFailure = createAction(
  '[Role] Edit Role Failure',
  props<{ error: IError }>()
);

// remove
const removeRole = createAction(
  '[Role] Remove Role',
  props<{ roleId: number }>()
);

const removeRoleSuccess = createAction(
  '[Role] Remove Role Success',
  props<{ roleId: number }>()
);

const removeRoleFailure = createAction(
  '[Role] Remove Role Failure',
  props<{ error: IError }>()
);

export const ActionRole = {
  loadRoles,
  loadRolesSuccess,
  loadRolesFailure,

  addRole,
  addRoleSuccess,
  addRoleFailure,

  editRole,
  editRoleSuccess,
  editRoleFailure,

  removeRole,
  removeRoleSuccess,
  removeRoleFailure,
};
