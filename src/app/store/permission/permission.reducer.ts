import { createReducer, on } from '@ngrx/store';
import { IPermissionState } from '../../core/interfaces/permission.interface';
import { ActionPermission } from './permission.actions';

const initialPermission: IPermissionState = {
  permissions: [],
  loading: false,
  error: null,
};

export const permissionReducer = createReducer(
  initialPermission,
  // load
  on(ActionPermission.loadPermissions, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ActionPermission.loadPermissionSuccess, (state, { permissions }) => ({
    ...state,
    permissions,
    loading: false,
  })),
  on(ActionPermission.loadPermissionFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // add
  on(ActionPermission.addPermission, (state) => {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),
  on(ActionPermission.addPermissionSuccess, (state, { permission }) => {
    return {
      ...state,
      loading: false,
      permissions: [...state.permissions, permission],
    };
  }),
  on(ActionPermission.addPermissionFailure, (state, { error }) => {
    return {
      ...state,
      loading: false,
      error,
    };
  }),

  // edit
  on(ActionPermission.editPermission, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ActionPermission.editPermissionSuccess, (state, { permission }) => ({
    ...state,
    loading: false,
    permissions: state.permissions.map((d) =>
      d.id === permission.id ? permission : d
    ),
  })),
  on(ActionPermission.editPermissionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // remove
  on(ActionPermission.removePermission, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ActionPermission.removePermissionSuccess, (state, { permissionId }) => ({
    ...state,
    permissions: state.permissions.filter((d) => d.id !== permissionId),
    loading: false,
  })),

  on(ActionPermission.removePermissionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
