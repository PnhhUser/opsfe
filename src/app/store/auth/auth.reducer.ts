import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { IAuthState } from '../../core/interfaces/auth.interface';

const initialState: IAuthState = {
  user: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),
  on(AuthActions.logoutSuccess, (state) => ({
    ...initialState,
  })),

  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Refresh Token
  on(AuthActions.refreshToken, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.refreshTokenSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),
  on(AuthActions.refreshTokenFailure, (state) => ({
    ...state,
    user: null,
    loading: false,
    error: { message: 'Session expired. Please login again.' },
  }))
);
