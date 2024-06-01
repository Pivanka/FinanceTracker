import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromAuthActions from '../actions/auth.actions';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

//useless
@Injectable()
export class AlertEffects {
  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromAuthActions.loginPage),
        tap(() => {
            // show alert
          }
        )
      ),
    { dispatch: false }
  );
  constructor(private actions$: Actions) {}
}
