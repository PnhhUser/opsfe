export enum roleEnum {
  Admin = 1,
  User = 2,
}

export class AccountModel {
  username: string | null = null;
  password: string | null = null;
  active!: boolean;
  role!: roleEnum;
}
