import { RoleEnum } from '../enum/role.enum';
import { IError } from './error.interface';

export interface ILoadAccount {
  accountId: number;
  createdAt: string;
  role: RoleEnum;
  isAction: boolean;
  lastseen: string;
  updatedAt: string;
  username: string;
}

export interface IAccount {
  username: string;
  password: string;
  active: boolean;
  role: RoleEnum;
}

export interface IUpdateAccount extends IAccount {
  accountId: number;
}

export interface IAccountState {
  accounts: ILoadAccount[];
  loading: boolean;
  error: IError | null;
}
