import { RoleEnum } from '../enum/role.enum';
import { IError } from './error.interface';
import { IRole } from './role.interface';

export interface ILoadAccount {
  accountId: number;
  createdAt: string;
  roleId: RoleEnum;
  role?: IRole;
  isActive: boolean;
  lastseen: string;
  updatedAt: string;
  username: string;
}

export interface IAccount {
  username: string;
  password: string;
  isActive: boolean;
  roleId: RoleEnum;
}

export interface IUpdateAccount extends IAccount {
  accountId: number;
}

export interface IAccountState {
  accounts: ILoadAccount[];
  loading: boolean;
  error: IError | null;
}
