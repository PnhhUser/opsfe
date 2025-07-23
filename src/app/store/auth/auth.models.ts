import { IError } from '../../core/interfaces/error.interface';
import { IUser } from '../../core/interfaces/user.interface';

export interface AuthState {
  user: IUser | null;
  loading: boolean;
  error: IError | null;
}
