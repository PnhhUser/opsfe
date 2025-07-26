import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IResponseCustom } from '../interfaces/response.interface';
import { apiUrl } from '../const/api.const';
import { ILoginForm, IUser } from '../interfaces/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(loginform: ILoginForm): Observable<IResponseCustom<IUser>> {
    return this.http.post<IResponseCustom<IUser>>(
      `${apiUrl}/auth/login`,
      loginform,
      { withCredentials: true }
    );
  }

  checkAuth(): Observable<IResponseCustom<IUser>> {
    return this.http.get<IResponseCustom<IUser>>(`${apiUrl}/auth/check-auth`, {
      withCredentials: true,
    });
  }

  logout(): Observable<IResponseCustom<any>> {
    return this.http.post<IResponseCustom<any>>(
      `${apiUrl}/auth/logout`,
      {},
      { withCredentials: true }
    );
  }

  refreshToken(): Observable<IResponseCustom<IUser>> {
    return this.http.post<IResponseCustom<IUser>>(
      `${apiUrl}/auth/refresh`,
      {},
      { withCredentials: true }
    );
  }
}
