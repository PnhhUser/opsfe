import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IResponseCustom } from '../interfaces/response.interface';
import { ILoginForm, IUser } from '../interfaces/auth.interface';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(loginform: ILoginForm): Observable<IResponseCustom<IUser>> {
    return this.http.post<IResponseCustom<IUser>>(
      `${this.apiUrl}/auth/login`,
      loginform,
      { withCredentials: true }
    );
  }

  checkAuth(): Observable<IResponseCustom<IUser>> {
    return this.http.get<IResponseCustom<IUser>>(
      `${this.apiUrl}/auth/check-auth`,
      {
        withCredentials: true,
      }
    );
  }

  logout(): Observable<IResponseCustom<any>> {
    return this.http.post<IResponseCustom<any>>(
      `${this.apiUrl}/auth/logout`,
      {},
      { withCredentials: true }
    );
  }

  refreshToken(): Observable<IResponseCustom<IUser>> {
    return this.http.post<IResponseCustom<IUser>>(
      `${this.apiUrl}/auth/refresh`,
      {},
      { withCredentials: true }
    );
  }
}
