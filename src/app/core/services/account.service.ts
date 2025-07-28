import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseCustom } from '../interfaces/response.interface';
import {
  IAccount,
  ILoadAccount,
  IUpdateAccount,
} from '../interfaces/account.interface';
import { apiUrl } from '../const/api.const';
import { AccountModel } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  constructor(private http: HttpClient) {}

  getAccounts(): Observable<IResponseCustom<ILoadAccount[]>> {
    return this.http.get<IResponseCustom<ILoadAccount[]>>(
      `${apiUrl}/accounts`,
      {
        withCredentials: true,
      }
    );
  }

  addAccount(model: AccountModel): Observable<IResponseCustom<ILoadAccount>> {
    return this.http.post<IResponseCustom<ILoadAccount>>(
      `${apiUrl}/accounts`,
      model,
      {
        withCredentials: true,
      }
    );
  }

  getAccount(accountId: number): Observable<IResponseCustom<IUpdateAccount>> {
    return this.http.get<IResponseCustom<IUpdateAccount>>(
      `${apiUrl}/accounts/${accountId}`,
      {
        withCredentials: true,
      }
    );
  }

  updateAccount(
    account: IUpdateAccount
  ): Observable<IResponseCustom<ILoadAccount>> {
    return this.http.put<IResponseCustom<ILoadAccount>>(
      `${apiUrl}/accounts`,
      account,
      {
        withCredentials: true,
      }
    );
  }

  removeAccount(accountId: number): Observable<IResponseCustom<null>> {
    return this.http.delete<IResponseCustom<null>>(
      `${apiUrl}/accounts/${accountId}`,
      {
        withCredentials: true,
      }
    );
  }
}
