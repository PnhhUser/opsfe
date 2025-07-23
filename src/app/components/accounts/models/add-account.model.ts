export enum roleEnum {
  Admin = 1,
  User = 2,
}

export class AddAccountModel {
  username: string | null = null;
  password: string | null = null;
  active!: boolean;
  role!: roleEnum;
}
