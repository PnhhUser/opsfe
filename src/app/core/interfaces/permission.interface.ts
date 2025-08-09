import { IBase, IBaseState } from './base.interface';

export interface ILoadPermissions extends IBase {
  name: string;
  key: string;
  description: string;
}

export interface IPermission {
  name: string;
  key: string;
  description: string;
}

export interface IUpdatePermission extends IPermission {
  permissionId: number;
}

export interface IPermissionState extends IBaseState {
  permissions: ILoadPermissions[];
}
