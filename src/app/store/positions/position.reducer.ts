import { createReducer, on } from '@ngrx/store';
import { IPositionState } from '../../core/interfaces/position.interface';
import { ActionPosition } from './position.actions';

const initialPosition: IPositionState = {
  positions: [],
  loading: false,
  error: null,
};

export const positionReducer = createReducer(
  initialPosition,
  // load
  on(ActionPosition.loadPositions, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ActionPosition.loadPositionsSuccess, (state, { positions }) => ({
    ...state,
    loading: false,
    positions,
  })),
  on(ActionPosition.loadPositionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // add
  on(ActionPosition.addPosition, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ActionPosition.addPositionSuccess, (state, { position }) => ({
    ...state,
    loading: false,
    positions: [...state.positions, position],
  })),
  on(ActionPosition.addPositionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // edit
  on(ActionPosition.editPosition, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ActionPosition.editPositionSuccess, (state, { position }) => ({
    ...state,
    loading: false,
    positions: state.positions.map((p) =>
      p.positionId === position.positionId ? position : p
    ),
  })),
  on(ActionPosition.editPositionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // remove
  on(ActionPosition.removePosition, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ActionPosition.removePositionSuccess, (state, { positionId }) => ({
    ...state,
    loading: false,
    positions: state.positions.filter((p) => p.positionId != positionId),
  })),
  on(ActionPosition.removePositionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
