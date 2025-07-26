import { RoleEnum } from '../enum/role.enum';
import { IAccount } from '../interfaces/account.interface';

export class AccountModel {
  public username: string;
  public password: string;
  public roleId: RoleEnum;
  public isActive: boolean;

  constructor(account: IAccount) {
    if (account.username.includes(' ')) {
      throw new Error('Username must not contain spaces');
    }

    if (!account.password || account.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    this.username = account.username;
    this.password = account.password;
    this.isActive = account.active;
    this.roleId = account.role;
  }

  public isPasswordMatch(rawPassword: string): boolean {
    return this.password === rawPassword;
  }
}
