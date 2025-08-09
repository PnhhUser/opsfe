import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponseCustom } from '../interfaces/response.interface';
import {
  ILoadPermissions,
  IPermission,
  IUpdatePermission,
} from '../interfaces/permission.interface';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  apiUrl: string = environment.apiUrl;
  pathName = 'permissions';
  url = `${this.apiUrl}/${this.pathName}`;

  constructor(private http: HttpClient) {}

  getPermissions(): Observable<IResponseCustom<ILoadPermissions[]>> {
    return this.http.get<IResponseCustom<ILoadPermissions[]>>(this.url, {
      withCredentials: true,
    });
  }

  addPermission(
    permission: IPermission
  ): Observable<IResponseCustom<ILoadPermissions>> {
    return this.http.post<IResponseCustom<ILoadPermissions>>(
      this.url,
      permission,
      {
        withCredentials: true,
      }
    );
  }

  updatePermission(
    permission: IUpdatePermission
  ): Observable<IResponseCustom<ILoadPermissions>> {
    return this.http.put<IResponseCustom<ILoadPermissions>>(
      this.url,
      permission,
      {
        withCredentials: true,
      }
    );
  }

  removePermission(permissionId: number): Observable<IResponseCustom<null>> {
    return this.http.delete<IResponseCustom<null>>(
      `${this.url}/${permissionId}`,
      {
        withCredentials: true,
      }
    );
  }
}
