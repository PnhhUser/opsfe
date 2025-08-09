import { createReducer, on } from '@ngrx/store';
import { IRoleState } from '../../core/interfaces/role.interface';
import { ActionRole } from './role.actions';

const initialRole: IRoleState = {
  roles: [],
  loading: false,
  error: null,
};

export const roleReducer = createReducer(
  initialRole,
  // load
  on(ActionRole.loadRoles, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ActionRole.loadRolesSuccess, (state, { roles }) => ({
    ...state,
    roles,
    loading: false,
  })),
  on(ActionRole.loadRolesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // add
  on(ActionRole.addRole, (state) => {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),
  on(ActionRole.addRoleSuccess, (state, { role }) => {
    return {
      ...state,
      loading: false,
      roles: [...state.roles, role],
    };
  }),
  on(ActionRole.addRoleFailure, (state, { error }) => {
    return {
      ...state,
      loading: false,
      error,
    };
  }),

  // edit
  on(ActionRole.editRole, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ActionRole.editRoleSuccess, (state, { role }) => ({
    ...state,
    loading: false,
    roles: state.roles.map((d) => (d.id === role.id ? role : d)),
  })),
  on(ActionRole.editRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // remove
  on(ActionRole.removeRole, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ActionRole.removeRoleSuccess, (state, { roleId }) => ({
    ...state,
    roles: state.roles.filter((d) => d.id !== roleId),
    loading: false,
  })),

  on(ActionRole.removeRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
