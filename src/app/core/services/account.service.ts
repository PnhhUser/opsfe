import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseCustom } from '../models/response.model';
import { IAccount } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<IResponseCustom<IAccount[]>> {
    return this.http.get<IResponseCustom<IAccount[]>>(
      `${this.apiUrl}/accounts`,
      {
        withCredentials: true,
      }
    );
  }
}
