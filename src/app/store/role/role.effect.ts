import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { catchError, exhaustMap, map, mergeMap, of } from 'rxjs';
import { RoleService } from '../../core/services/role.service';
import { ActionRole } from './role.actions';

@Injectable()
export class RoleEffect {
  loadRoles$;
  addRole$;
  editRole$;
  removeRole$;

  constructor(private roleService: RoleService, private actions$: Actions) {
    this.loadRoles$ = createEffect(() => this.load());
    this.addRole$ = createEffect(() => this.add());
    this.editRole$ = createEffect(() => this.edit());
    this.removeRole$ = createEffect(() => this.remove());
  }

  load() {
    return this.actions$.pipe(
      ofType(ActionRole.loadRoles),
      mergeMap(() => {
        return this.roleService.getRoles().pipe(
          map((response) => {
            return ActionRole.loadRolesSuccess({
              roles: response.data,
            });
          }),
          catchError((error) => {
            return of(
              ActionRole.loadRolesFailure({
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
      ofType(ActionRole.addRole),
      exhaustMap(({ role }) => {
        return this.roleService.addRole(role).pipe(
          map((response) => {
            return ActionRole.addRoleSuccess({
              role: response.data,
            });
          }),
          catchError((error) => {
            return of(
              ActionRole.addRoleFailure({
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
      ofType(ActionRole.editRole),
      exhaustMap(({ role }) => {
        return this.roleService.updateRole(role).pipe(
          map((res) => {
            return ActionRole.editRoleSuccess({
              role: res.data,
            });
          }),
          catchError((e) => {
            return of(
              ActionRole.editRoleFailure({
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
      ofType(ActionRole.removeRole),
      exhaustMap(({ roleId }) =>
        this.roleService.removeRole(roleId).pipe(
          map(() => ActionRole.removeRoleSuccess({ roleId })),
          catchError((e) =>
            of(
              ActionRole.removeRoleFailure({
                error: { message: e?.error?.message || 'Có lỗi xảy ra' },
              })
            )
          )
        )
      )
    );
  }
}
