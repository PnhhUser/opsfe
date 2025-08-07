import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PositionService } from '../../core/services/position.service';
import { ActionPosition } from './position.actions';
import { catchError, delay, exhaustMap, map, mergeMap, of } from 'rxjs';

@Injectable()
export class PositionEffect {
  loadPosition$;
  addPosition$;
  editPosition$;
  removePosition$;

  constructor(
    private actions$: Actions,
    private positionService: PositionService
  ) {
    this.loadPosition$ = createEffect(() => this.loadPositions());
    this.addPosition$ = createEffect(() => this.addPosition());
    this.editPosition$ = createEffect(() => this.editPosition());
    this.removePosition$ = createEffect(() => this.removePosition());
  }

  loadPositions() {
    return this.actions$.pipe(
      ofType(ActionPosition.loadPositions),
      mergeMap(() => {
        return this.positionService.getPositions().pipe(
          delay(500),
          map((response) => {
            return ActionPosition.loadPositionsSuccess({
              positions: response.data,
            });
          }),
          catchError((error) => {
            return of(
              ActionPosition.loadPositionsFailure({
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

  addPosition() {
    return this.actions$.pipe(
      ofType(ActionPosition.addPosition),
      exhaustMap(({ position }) => {
        return this.positionService.addPosition(position).pipe(
          map((response) => {
            return ActionPosition.addPositionSuccess({
              position: response.data,
            });
          }),
          catchError((error) => {
            return of(
              ActionPosition.addPositionFailure({
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

  editPosition() {
    return this.actions$.pipe(
      ofType(ActionPosition.editPosition),
      exhaustMap(({ position }) => {
        return this.positionService.updatePosition(position).pipe(
          map((res) => {
            return ActionPosition.editPositionSuccess({
              position: res.data,
            });
          }),
          catchError((e) => {
            return of(
              ActionPosition.editPositionFailure({
                error: { message: e.error.message || 'Lỗi chưa xác thực' },
              })
            );
          })
        );
      })
    );
  }

  removePosition() {
    return this.actions$.pipe(
      ofType(ActionPosition.removePosition),
      exhaustMap(({ positionId }) =>
        this.positionService.removePosition(positionId).pipe(
          map(() => ActionPosition.removePositionSuccess({ positionId })),
          catchError((e) =>
            of(
              ActionPosition.removePositionFailure({
                error: { message: e?.error?.message || 'Có lỗi xảy ra' },
              })
            )
          )
        )
      )
    );
  }
}
