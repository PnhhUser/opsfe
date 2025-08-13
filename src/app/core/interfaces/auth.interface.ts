import { IError } from './error.interface';

// login
export interface ILoginForm {
  username: string;
  password: string;
}

// user
export interface IUser {
  id: number;
  name: string;
  roleId: number;
}

// auth
export interface IAuthState {
  user: IUser | null;
  loading: boolean;
  error: IError | null;
}
