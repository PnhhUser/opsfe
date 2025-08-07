import { Gender } from '../enum/gender.enum';
import { IError } from './error.interface';

export interface ILoadEmployee {
  employeeId: number;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  gender: Gender;
  dateOfBirth: Date | null;
  startDate: Date | null;
  isActive: boolean;
  positionName: string;
  accountName: string;
  departmentName: string;
  createAt: Date;
  updateAt: Date;
}

export interface IEmployee {
  fullName: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  gender: Gender;
  dateOfBirth: Date | null;
  startDate: Date | null;
  isActive: boolean;
  positionId: number | null;
  accountId: number | null;
}

export interface IUpdateEmployee extends IEmployee {
  employeeId: number;
}

export interface IEmployeeState {
  employees: ILoadEmployee[];
  loading: boolean;
  error: IError | null;
}
