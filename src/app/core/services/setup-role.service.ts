import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponseCustom } from '../interfaces/response.interface';

@Injectable({ providedIn: 'root' })
export class SetupRoleService {
  apiUrl: string = environment.apiUrl;
  pathName = 'role-permission';
  url = `${this.apiUrl}/${this.pathName}`;

  constructor(private http: HttpClient) {}

  getPermissionsByRoleId(roleId: number): Observable<IResponseCustom<any>> {
    return this.http.get<IResponseCustom<any>>(
      `${this.url}/role/${roleId}/permissions`,
      {
        withCredentials: true,
      }
    );
  }

  setRolePermissions(data: {
    roleId: number;
    permissionIds: number[];
  }): Observable<IResponseCustom<null>> {
    return this.http.put<IResponseCustom<null>>(`${this.url}/saved`, data, {
      withCredentials: true,
    });
  }

  // check quyền
  hasPermission(
    roleId: number,
    permissionId: number
  ): Observable<IResponseCustom<{ hasPermission: boolean }>> {
    return this.http.get<IResponseCustom<{ hasPermission: boolean }>>(
      `${this.url}/has-permission/${roleId}/${permissionId}`,
      {
        withCredentials: true,
      }
    );
  }
}
