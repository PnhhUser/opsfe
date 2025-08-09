import { IBase, IBaseState } from './base.interface';

export interface ILoadRoles extends IBase {
  name: string;
  key: string;
  description: string;
}

export interface IRole {
  name: string;
  key: string;
  description: string;
}

export interface IUpdateRole extends IRole {
  roleId: number;
}

export interface IRoleState extends IBaseState {
  roles: ILoadRoles[];
}
