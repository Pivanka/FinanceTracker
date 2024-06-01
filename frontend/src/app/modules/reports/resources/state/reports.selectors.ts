import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as ReportsReducer from './reports.reducer';

export const selectReportsState = createFeatureSelector<ReportsReducer.State>(
  ReportsReducer.reportsFeatureKey
);

export const selectChart = createSelector(
  selectReportsState,
  state => state.simpleChart
);

export const selectIsLoading = createSelector(
  selectReportsState,
  state => state.isLoading
);


export const selectOptimizingChart = createSelector(
  selectReportsState,
  state => state.optimizingChart
);
