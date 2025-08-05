import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IPositionState } from '../../core/interfaces/position.interface';

const KEY_NAME = 'position';

const selectPositionState = createFeatureSelector<IPositionState>(KEY_NAME);

export const selectPositions = createSelector(
  selectPositionState,
  (s) => s.positions
);

export const selectPositionLoading = createSelector(
  selectPositionState,
  (s) => s.loading
);

export const selectPositionError = createSelector(
  selectPositionState,
  (s) => s.error
);
