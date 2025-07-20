import { IError } from '../../core/models/error.model';
import { IUser } from '../../core/models/user.model';

export interface AuthState {
  user: IUser | null;
  loading: boolean;
  error: IError | null;
}
