import { createAction, props } from '@ngrx/store';
import {
  ILoadPosition,
  IPosition,
  IUpdatePosition,
} from '../../core/interfaces/position.interface';
import { IError } from '../../core/interfaces/error.interface';

// load
const loadPositions = createAction('[Position] Load Position');

const loadPositionsSuccess = createAction(
  '[Position] Load Position Success',
  props<{ positions: ILoadPosition[] }>()
);

const loadPositionsFailure = createAction(
  '[Position] Load Position Failure',
  props<{ error: IError }>()
);

// add
const addPosition = createAction(
  '[Position] Add Position',
  props<{ position: IPosition }>()
);

const addPositionSuccess = createAction(
  '[Position] Add Position Success',
  props<{ position: ILoadPosition }>()
);

const addPositionFailure = createAction(
  '[Position] Add Position Failure',
  props<{ error: IError }>()
);

// edit
const editPosition = createAction(
  '[Position] Edit Position',
  props<{ position: IUpdatePosition }>()
);

const editPositionSuccess = createAction(
  '[Position] Edit Position Success',
  props<{ position: ILoadPosition }>()
);

const editPositionFailure = createAction(
  '[Position] Edit Position Failure',
  props<{ error: IError }>()
);

// remove
const removePosition = createAction(
  '[Position] Remove Position',
  props<{ positionId: number }>()
);

const removePositionSuccess = createAction(
  '[Position] Remove Position Success',
  props<{ positionId: number }>()
);

const removePositionFailure = createAction(
  '[Position] Remove Position Failure',
  props<{ error: IError }>()
);

export const ActionPosition = {
  loadPositions,
  loadPositionsSuccess,
  loadPositionsFailure,

  addPosition,
  addPositionSuccess,
  addPositionFailure,

  editPosition,
  editPositionSuccess,
  editPositionFailure,

  removePosition,
  removePositionSuccess,
  removePositionFailure,
};
