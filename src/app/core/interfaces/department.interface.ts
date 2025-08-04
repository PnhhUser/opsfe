import { IError } from './error.interface';

export interface IloadDepartment {
  departmentId: number;
  name: string;
  key: string;
  description: string;
  createAt: string;
  updateAt: string;
}

export interface IDepartment {
  name: string;
  key: string;
  description: string;
}

export interface IUpdateDepertment extends IDepartment {
  departmentId: number;
}

export interface IDepartmentState {
  departments: IloadDepartment[];
  loading: boolean;
  error: IError | null;
}
