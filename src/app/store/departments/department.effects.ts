import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DepartmentService } from './../../core/services/department.service';
import { Injectable } from '@angular/core';
import { ActionDepartment } from './department.actions';
import { catchError, exhaustMap, map, mergeMap, of } from 'rxjs';

@Injectable()
export class DepartmentEffect {
  loadDepartments$;
  addDepartment$;
  constructor(
    private departmentService: DepartmentService,
    private actions$: Actions
  ) {
    this.loadDepartments$ = createEffect(() => this.loadDepartments());
    this.addDepartment$ = createEffect(() => this.addDepartment());
  }

  loadDepartments() {
    return this.actions$.pipe(
      ofType(ActionDepartment.loadDepartments),
      mergeMap(() => {
        return this.departmentService.getDepartments().pipe(
          map((response) => {
            return ActionDepartment.loadDepartmentsSuccess({
              departments: response.data,
            });
          }),
          catchError((error) => {
            return of(
              ActionDepartment.loadDepartmentsFailure({
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

  addDepartment() {
    return this.actions$.pipe(
      ofType(ActionDepartment.AddDeparment),
      exhaustMap(({ department }) => {
        return this.departmentService.addDepartment(department).pipe(
          map((response) => {
            return ActionDepartment.AddDepartmentSuccess({
              department: response.data,
            });
          }),
          catchError((error) => {
            return of(
              ActionDepartment.AddDepartmentFailure({
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
}
