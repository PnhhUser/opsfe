import { Injectable } from '@angular/core';
import { EmployeeService } from '../../core/services/employee.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActionEmployee } from './employee.actions';
import { catchError, exhaustMap, map, mergeMap, of } from 'rxjs';

@Injectable()
export class EmployeeEffect {
  loadEmps$;
  addEmp$;
  editEmp$;
  removeEmp$;

  constructor(
    private employeeService: EmployeeService,
    private actions$: Actions
  ) {
    this.loadEmps$ = createEffect(() => this.loadEmps());
    this.addEmp$ = createEffect(() => this.addEmp());
    this.editEmp$ = createEffect(() => this.editEmp());
    this.removeEmp$ = createEffect(() => this.removeEmp());
  }

  loadEmps() {
    return this.actions$.pipe(
      ofType(ActionEmployee.loadEmployees),
      mergeMap(() => {
        return this.employeeService.getEmployees().pipe(
          map((response) => {
            return ActionEmployee.loadEmployeeSuccess({
              employees: response.data,
            });
          }),
          catchError((error) => {
            return of(
              ActionEmployee.loadEmployeesFailure({
                error: {
                  message: error?.error?.message || 'Lỗi không xác định',
                },
              })
            );
          })
        );
      })
    );
  }

  addEmp() {
    return this.actions$.pipe(
      ofType(ActionEmployee.addEmployee),
      exhaustMap(({ employee }) => {
        return this.employeeService.addEmployee(employee).pipe(
          map((response) => {
            return ActionEmployee.addEmployeeSuccess({
              employee: response.data,
            });
          }),
          catchError((error) => {
            return of(
              ActionEmployee.addEmployeeFailure({
                error: {
                  message: error?.error?.message || 'Lỗi chưa xác định',
                },
              })
            );
          })
        );
      })
    );
  }

  editEmp() {
    return this.actions$.pipe(
      ofType(ActionEmployee.editEmployee),
      exhaustMap(({ employee }) => {
        return this.employeeService.updateEmployee(employee).pipe(
          map((res) => {
            return ActionEmployee.editEmployeeSuccess({
              employee: res.data,
            });
          }),
          catchError((e) => {
            return of(
              ActionEmployee.editEmployeeFailure({
                error: { message: e.error.message || 'Lỗi chưa xác thực' },
              })
            );
          })
        );
      })
    );
  }

  removeEmp() {
    return this.actions$.pipe(
      ofType(ActionEmployee.removeEmployee),
      exhaustMap(({ employeeId }) =>
        this.employeeService.removeEmployee(employeeId).pipe(
          map(() => ActionEmployee.removeEmployeeSuccess({ employeeId })),
          catchError((e) =>
            of(
              ActionEmployee.removeEmployeeFailure({
                error: { message: e?.error?.message || 'Có lỗi xảy ra' },
              })
            )
          )
        )
      )
    );
  }
}
