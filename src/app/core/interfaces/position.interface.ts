import { IError } from './error.interface';

export interface ILoadPosition {
  positionId: number;
  name: string;
  key: string;
  departmentName: string | null;
  baseSalary: number | null;
  description: string | null;
  createAt: string;
  updateAt: string;
}

export interface IPosition {
  name: string;
  key: string;
  departmentId: number | null;
  baseSalary: number | null;
  description: string | null;
}

export interface IUpdatePosition extends IPosition {
  positionId: number;
}

export interface IPositionState {
  positions: ILoadPosition[];
  loading: boolean;
  error: IError | null;
}
