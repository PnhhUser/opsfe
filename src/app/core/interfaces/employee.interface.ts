import { Gender } from '../enum/gender.enum';

export interface ILoadEmployee {
  employeeId: number;
  fullname: string;
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
  fullname: string;
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
}

export interface IUpdateEmployee extends IEmployee {
  employeeId: number;
}
