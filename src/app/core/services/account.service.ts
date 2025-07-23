import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseCustom } from '../interfaces/response.interface';
import { IAccount } from '../interfaces/account.interface';
import { apiUrl } from '../const/api.const';
import { AddAccountModel } from '../../components/accounts/models/add-account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  constructor(private http: HttpClient) {}

  getAccounts(): Observable<IResponseCustom<IAccount[]>> {
    return this.http.get<IResponseCustom<IAccount[]>>(`${apiUrl}/accounts`, {
      withCredentials: true,
    });
  }

  addAccount(model: AddAccountModel): Observable<AddAccountModel> {
    return this.http.post<AddAccountModel>(
      `${apiUrl}/accounts`,
      {
        username: model.username,
        password: model.password,
        roleId: model.role,
      },
      {
        withCredentials: true,
      }
    );
  }
}
