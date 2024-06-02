import { Injectable } from '@angular/core';
import * as ReportsActions from './reports.actions';
import { SimpleChart } from '../models/simple-chart';
import { catchError, map, mergeMap, of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from '../../../../core/resources/services/api.service';
import { OptimizeBudgetResult } from '../models/optimizing-budget';

@Injectable()
export class ReportsEffects {
  loadActions$ = createEffect(() =>{
    return this.actions$.pipe(
      ofType(ReportsActions.loadChart),
      mergeMap((action) =>
        this.service.post<SimpleChart>('/api/report', {type: action.transactionType, to: action.to, from: action.from, accountId: action.accountId}).pipe(
        map((data) =>
          ReportsActions.loadChartSuccess({ result: data })
        ),
        catchError((error) =>
          of(ReportsActions.loadChartFailure({error: error.status}))
        )
      )
    )
  )});

  optimize$ = createEffect(() =>{
    return this.actions$.pipe(
      ofType(ReportsActions.optimizeBudget),
      mergeMap((action) =>
        this.service.post<OptimizeBudgetResult>('/api/report/optimizing', action.request).pipe(
        map((data) =>
          ReportsActions.optimizeBudgetSuccess({ result: data })
        ),
        catchError((error) =>
          of(ReportsActions.optimizeBudgetFailure({error: error.status}))
        )
      )
    )
  )});

  constructor(private actions$: Actions,
    private service: ApiService) {}
}
