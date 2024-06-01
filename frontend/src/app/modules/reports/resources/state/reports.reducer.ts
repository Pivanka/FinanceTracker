import {  createReducer, on } from '@ngrx/store';
import * as ReportsActions from './reports.actions';
import { SimpleChart } from '../models/simple-chart';
import { OptimizeBudgetResult } from '../models/optimizing-budget';

export const reportsFeatureKey = 'reports';

export interface State {
  simpleChart: SimpleChart | null;
  isLoading: boolean,
  error: any,
  optimizingChart: OptimizeBudgetResult | null
}

export const initialState: State = {
  simpleChart: null,
  isLoading: false,
  error: null,
  optimizingChart: null
};

export const reducer = createReducer(
  initialState,

  on(ReportsActions.loadChart, (state, action) => ({
    ...state,
    isLoading: true,
    simpleChart: null
   })
  ),
  on(ReportsActions.loadChartSuccess, (state, action) => ({
    ...state,
    simpleChart: action.result,
    isLoading: false,
    error: null
   })
  ),
  on(ReportsActions.loadChartFailure, (state, action) => ({
      ...state,
      error: action.error,
      isLoading: false,
    })
  ),
  on(ReportsActions.optimizeBudget, (state, action) => ({
      ...state,
      isLoading: true,
    })
  ),
  on(ReportsActions.optimizeBudgetSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      optimizingChart: action.result,
    })
  ),
  on(ReportsActions.optimizeBudgetFailure, (state, action) => ({
      ...state,
      error: action.error,
      isLoading: false,
    })
  ),
);
