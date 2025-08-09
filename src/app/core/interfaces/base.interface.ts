import { IError } from './error.interface';

export interface IBase {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBaseState {
  loading: boolean;
  error: IError | null;
}
