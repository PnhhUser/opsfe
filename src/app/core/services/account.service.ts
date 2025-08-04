import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseCustom } from '../interfaces/response.interface';
import {
  IAccount,
  ILoadAccount,
  IUpdateAccount,
} from '../interfaces/account.interface';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<IResponseCustom<ILoadAccount[]>> {
    return this.http.get<IResponseCustom<ILoadAccount[]>>(
      `${this.apiUrl}/accounts`,
      {
        withCredentials: true,
      }
    );
  }

  addAccount(model: IAccount): Observable<IResponseCustom<ILoadAccount>> {
    return this.http.post<IResponseCustom<ILoadAccount>>(
      `${this.apiUrl}/accounts`,
      model,
      {
        withCredentials: true,
      }
    );
  }

  getAccount(accountId: number): Observable<IResponseCustom<IUpdateAccount>> {
    return this.http.get<IResponseCustom<IUpdateAccount>>(
      `${this.apiUrl}/accounts/${accountId}`,
      {
        withCredentials: true,
      }
    );
  }

  updateAccount(
    account: IUpdateAccount
  ): Observable<IResponseCustom<ILoadAccount>> {
    return this.http.put<IResponseCustom<ILoadAccount>>(
      `${this.apiUrl}/accounts`,
      account,
      {
        withCredentials: true,
      }
    );
  }

  removeAccount(accountId: number): Observable<IResponseCustom<null>> {
    return this.http.delete<IResponseCustom<null>>(
      `${this.apiUrl}/accounts/${accountId}`,
      {
        withCredentials: true,
      }
    );
  }
}
