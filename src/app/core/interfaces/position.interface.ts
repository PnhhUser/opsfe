export interface ILoadPosition {
  positionId: number;
  name: string;
  key: string;
  baseSalary: number | null;
  description: string | null;
  createAt: Date;
  updateAt: Date;
}

export interface IPosition {
  name: string;
  key: string;
  baseSalary: number | null;
  description: string | null;
}

export interface IUpdatePosition extends IPosition {
  positionId: number;
}
