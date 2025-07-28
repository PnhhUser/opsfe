import { RoleEnum } from '../enum/role.enum';
import { IAccount, IUpdateAccount } from '../interfaces/account.interface';

export class AccountModel {
  public username: string;
  public password: string;
  public role: RoleEnum;
  public active: boolean;

  constructor(account: IAccount) {
    if (account.username.includes(' ')) {
      throw new Error('Username must not contain spaces');
    }

    if (!account.password || account.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    this.username = account.username;
    this.password = account.password;
    this.active = account.active;
    this.role = account.role;
  }

  public isPasswordMatch(rawPassword: string): boolean {
    return this.password === rawPassword;
  }
}
