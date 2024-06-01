import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromAuthActions from '../actions/auth.actions';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromSpinnerActions from '../actions/spinner.actions'
import * as fromGeneralActions from '../../modules/general/resources/state/general.actions';
import * as fromTransactionsActions from '../../modules/transactions/resources/state/transactions.actions';
import { loadChart, loadChartFailure, loadChartSuccess } from '../../modules/reports/resources/state/reports.actions';

@Injectable()
export class SpinnerEffects {
  spinneron$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          fromAuthActions.loginPage,
          fromGeneralActions.loadMembers, fromGeneralActions.loadAccounts,
          fromTransactionsActions.loadPaginatedTransactions,
          loadChart
        ),
        tap(() =>  {
          this.store$.dispatch(fromSpinnerActions.showSpinner());
        })
      ),
    { dispatch: false }
  );

  spinneroff$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          fromAuthActions.loginSuccess,
          fromAuthActions.loginFailure,
          fromGeneralActions.loadMembersSuccess,
          fromGeneralActions.loadMembersFailure,
          fromGeneralActions.loadAccountsSuccess,
          fromTransactionsActions.loadPaginatedTransactionsSuccess, fromTransactionsActions.loadPaginatedTransactionsFailure,
          loadChartSuccess, loadChartFailure
        ),
        tap(() => {
          setTimeout(() => {
            this.store$.dispatch(fromSpinnerActions.hideSpinner());
          }, 1000);
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private store$: Store) {}
}
