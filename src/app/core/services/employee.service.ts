import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseCustom } from '../interfaces/response.interface';
import { environment } from '../../../environments/environment';
import {
  IEmployee,
  ILoadEmployee,
  IUpdateEmployee,
} from '../interfaces/employee.interface';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  apiUrl: string = environment.apiUrl;
  path: string = 'employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<IResponseCustom<ILoadEmployee[]>> {
    return this.http.get<IResponseCustom<ILoadEmployee[]>>(
      `${this.apiUrl}/${this.path}`,
      {
        withCredentials: true,
      }
    );
  }

  addEmployee(employee: IEmployee): Observable<IResponseCustom<ILoadEmployee>> {
    return this.http.post<IResponseCustom<ILoadEmployee>>(
      `${this.apiUrl}/${this.path}`,
      employee,
      {
        withCredentials: true,
      }
    );
  }

  updateEmployee(
    employee: IUpdateEmployee
  ): Observable<IResponseCustom<ILoadEmployee>> {
    return this.http.put<IResponseCustom<ILoadEmployee>>(
      `${this.apiUrl}/${this.path}`,
      employee,
      {
        withCredentials: true,
      }
    );
  }

  removeEmployee(employeeId: number): Observable<IResponseCustom<null>> {
    return this.http.delete<IResponseCustom<null>>(
      `${this.apiUrl}/${this.path}/${employeeId}`,
      {
        withCredentials: true,
      }
    );
  }

  availableAccounts(): Observable<IResponseCustom<any[]>> {
    return this.http.get<IResponseCustom<any[]>>(
      `${this.apiUrl}/${this.path}/available`,
      {
        withCredentials: true,
      }
    );
  }
}
