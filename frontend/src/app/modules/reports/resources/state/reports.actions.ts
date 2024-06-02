import { createAction, props } from '@ngrx/store';
import { SimpleChart } from '../models/simple-chart';
import { TransactionType } from '../../../dashboard/resources/models/transaction';
import { OptimizeBudgetRequest, OptimizeBudgetResult } from '../models/optimizing-budget';

// load chart
export const loadChart = createAction(
  '[Reports Component] Load Chart',
  props<{ transactionType: TransactionType, from: string | undefined, to: string | undefined, accountId: string | undefined}>()
);

export const loadChartSuccess = createAction(
  '[Reports Effects] Load Chart Success',
  props<{ result: SimpleChart | null }>()
);

export const loadChartFailure = createAction(
  '[Reports Effects] Load Chart Failure',
  props<{ error: any }>()
);

// optimizing
export const optimizeBudget = createAction(
  '[Reports Component] Optimize Budget',
  props<{ request: OptimizeBudgetRequest }>()
);

export const optimizeBudgetSuccess = createAction(
  '[Reports Effects] Optimize Budget Success',
  props<{ result: OptimizeBudgetResult }>()
);

export const optimizeBudgetFailure = createAction(
  '[Reports Effects] Optimize Budget Failure',
  props<{ error: any }>()
);
