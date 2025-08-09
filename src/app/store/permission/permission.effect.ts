import { Actions, createEffect, ofType } from '@ngrx/effects';

import { Injectable } from '@angular/core';

import { catchError, exhaustMap, map, mergeMap, of } from 'rxjs';
import { PermissionService } from '../../core/services/permission.service';
import { ActionPermission } from './permission.actions';

@Injectable()
export class PermissionEffect {
  loadPermission$;
  addPermission$;
  editPermission$;
  removePermission$;

  constructor(
    private permissionService: PermissionService,
    private actions$: Actions
  ) {
    this.loadPermission$ = createEffect(() => this.load());
    this.addPermission$ = createEffect(() => this.add());
    this.editPermission$ = createEffect(() => this.edit());
    this.removePermission$ = createEffect(() => this.remove());
  }

  load() {
    return this.actions$.pipe(
      ofType(ActionPermission.loadPermissions),
      mergeMap(() => {
        return this.permissionService.getPermissions().pipe(
          map((response) => {
            return ActionPermission.loadPermissionSuccess({
              permissions: response.data,
            });
          }),
          catchError((error) => {
            return of(
              ActionPermission.loadPermissionFailure({
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

  add() {
    return this.actions$.pipe(
      ofType(ActionPermission.addPermission),
      exhaustMap(({ permission }) => {
        return this.permissionService.addPermission(permission).pipe(
          map((response) => {
            return ActionPermission.addPermissionSuccess({
              permission: response.data,
            });
          }),
          catchError((error) => {
            return of(
              ActionPermission.addPermissionFailure({
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

  edit() {
    return this.actions$.pipe(
      ofType(ActionPermission.editPermission),
      exhaustMap(({ permission }) => {
        return this.permissionService.updatePermission(permission).pipe(
          map((res) => {
            return ActionPermission.editPermissionSuccess({
              permission: res.data,
            });
          }),
          catchError((e) => {
            return of(
              ActionPermission.editPermissionFailure({
                error: { message: e.error.message || 'Lỗi chưa xác thực' },
              })
            );
          })
        );
      })
    );
  }

  remove() {
    return this.actions$.pipe(
      ofType(ActionPermission.removePermission),
      exhaustMap(({ permissionId }) =>
        this.permissionService.removePermission(permissionId).pipe(
          map(() => ActionPermission.removePermissionSuccess({ permissionId })),
          catchError((e) =>
            of(
              ActionPermission.removePermissionFailure({
                error: { message: e?.error?.message || 'Có lỗi xảy ra' },
              })
            )
          )
        )
      )
    );
  }
}
