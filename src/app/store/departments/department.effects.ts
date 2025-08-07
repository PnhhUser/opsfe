import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DepartmentService } from './../../core/services/department.service';
import { Injectable } from '@angular/core';
import { ActionDepartment } from './department.actions';
import { catchError, delay, exhaustMap, map, mergeMap, of } from 'rxjs';

@Injectable()
export class DepartmentEffect {
  loadDepartments$;
  addDepartment$;
  editDepartment$;
  removeDepartment$;

  constructor(
    private departmentService: DepartmentService,
    private actions$: Actions
  ) {
    this.loadDepartments$ = createEffect(() => this.loadDepartments());
    this.addDepartment$ = createEffect(() => this.addDepartment());
    this.editDepartment$ = createEffect(() => this.editDepartment());
    this.removeDepartment$ = createEffect(() => this.removeDepartment());
  }

  loadDepartments() {
    return this.actions$.pipe(
      ofType(ActionDepartment.loadDepartments),
      mergeMap(() => {
        return this.departmentService.getDepartments().pipe(
          delay(500),
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
      ofType(ActionDepartment.addDeparment),
      exhaustMap(({ department }) => {
        return this.departmentService.addDepartment(department).pipe(
          map((response) => {
            return ActionDepartment.addDepartmentSuccess({
              department: response.data,
            });
          }),
          catchError((error) => {
            return of(
              ActionDepartment.addDepartmentFailure({
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

  editDepartment() {
    return this.actions$.pipe(
      ofType(ActionDepartment.editDepartment),
      exhaustMap(({ department }) => {
        return this.departmentService.updateDepartment(department).pipe(
          map((res) => {
            return ActionDepartment.editDepartmentSuccess({
              department: res.data,
            });
          }),
          catchError((e) => {
            return of(
              ActionDepartment.editDepartmentFailure({
                error: { message: e.error.message || 'Lỗi chưa xác thực' },
              })
            );
          })
        );
      })
    );
  }

  removeDepartment() {
    return this.actions$.pipe(
      ofType(ActionDepartment.removeDepartment),
      exhaustMap(({ departmentId }) =>
        this.departmentService.removeDepartment(departmentId).pipe(
          map(() => ActionDepartment.removeDepartmentSuccess({ departmentId })),
          catchError((e) =>
            of(
              ActionDepartment.removeDepartmentFailure({
                error: { message: e?.error?.message || 'Có lỗi xảy ra' },
              })
            )
          )
        )
      )
    );
  }
}
