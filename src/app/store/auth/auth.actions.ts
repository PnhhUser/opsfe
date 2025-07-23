import { IError } from '../../core/interfaces/error.interface';
import { IUser } from '../../core/interfaces/user.interface';
import { ILoginForm } from './../../components/login/model/login.model';
import { createAction, props } from '@ngrx/store';

// Login Actions
export const login = createAction('[Auth] Login', props<ILoginForm>());

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: IUser }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: IError; source?: 'checkAuth' | 'manual' }>()
);

// Check Auth Actions
export const checkAuth = createAction('[Auth] Check Auth');

// lgout Actions
export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');
export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: IError }>()
);

// Refresh Token Actions
export const refreshToken = createAction('[Auth] Refresh Token');
export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ user: IUser }>()
);
export const refreshTokenFailure = createAction('[Auth] Refresh Token Failure');
