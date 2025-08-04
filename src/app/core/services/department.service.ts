import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseCustom } from '../interfaces/response.interface';
import { environment } from '../../../environments/environment';
import {
  IDepartment,
  IloadDepartment,
  IUpdateDepertment,
} from '../interfaces/department.interface';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<IResponseCustom<IloadDepartment[]>> {
    return this.http.get<IResponseCustom<IloadDepartment[]>>(
      `${this.apiUrl}/departments`,
      {
        withCredentials: true,
      }
    );
  }

  addDepartment(
    department: IDepartment
  ): Observable<IResponseCustom<IloadDepartment>> {
    return this.http.post<IResponseCustom<IloadDepartment>>(
      `${this.apiUrl}/departments`,
      department,
      {
        withCredentials: true,
      }
    );
  }

  updateDepartment(
    department: IUpdateDepertment
  ): Observable<IResponseCustom<IloadDepartment>> {
    return this.http.put<IResponseCustom<IloadDepartment>>(
      `${this.apiUrl}/departments`,
      department,
      {
        withCredentials: true,
      }
    );
  }

  removeDepartment(departmentId: number): Observable<IResponseCustom<null>> {
    return this.http.delete<IResponseCustom<null>>(
      `${this.apiUrl}/departments/${departmentId}`,
      {
        withCredentials: true,
      }
    );
  }
}
