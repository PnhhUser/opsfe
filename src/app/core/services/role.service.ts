import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponseCustom } from '../interfaces/response.interface';
import { ILoadRoles, IRole, IUpdateRole } from '../interfaces/role.interface';

@Injectable({ providedIn: 'root' })
export class RoleService {
  apiUrl: string = environment.apiUrl;
  pathName = 'roles';
  url = `${this.apiUrl}/${this.pathName}`;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<IResponseCustom<ILoadRoles[]>> {
    return this.http.get<IResponseCustom<ILoadRoles[]>>(this.url, {
      withCredentials: true,
    });
  }

  addRole(role: IRole): Observable<IResponseCustom<ILoadRoles>> {
    return this.http.post<IResponseCustom<ILoadRoles>>(this.url, role, {
      withCredentials: true,
    });
  }

  updateRole(role: IUpdateRole): Observable<IResponseCustom<ILoadRoles>> {
    return this.http.put<IResponseCustom<ILoadRoles>>(this.url, role, {
      withCredentials: true,
    });
  }

  removeRole(roleId: number): Observable<IResponseCustom<null>> {
    return this.http.delete<IResponseCustom<null>>(`${this.url}/${roleId}`, {
      withCredentials: true,
    });
  }
}
