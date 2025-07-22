import { filter, Observable, take } from 'rxjs';
import { IUser } from '../models/user.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILoginForm } from '../../components/login/model/login.model';
import { IResponseCustom } from '../models/response.model';
import { selectLoading } from '../../store/auth/auth.selectors';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  login(loginform: ILoginForm): Observable<IResponseCustom<IUser>> {
    return this.http.post<IResponseCustom<IUser>>(
      `${this.apiUrl}/login`,
      loginform,
      { withCredentials: true }
    );
  }

  checkAuth(): Observable<IResponseCustom<IUser>> {
    return this.http.get<IResponseCustom<IUser>>(`${this.apiUrl}/check-auth`, {
      withCredentials: true,
    });
  }

  logout(): Observable<IResponseCustom<any>> {
    return this.http.post<IResponseCustom<any>>(
      `${this.apiUrl}/logout`,
      {},
      { withCredentials: true }
    );
  }

  refreshToken(): Observable<IResponseCustom<IUser>> {
    return this.http.post<IResponseCustom<IUser>>(
      `${this.apiUrl}/refresh`,
      {},
      { withCredentials: true }
    );
  }
}
