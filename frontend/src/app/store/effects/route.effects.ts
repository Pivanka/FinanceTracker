import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import * as fromAuthActions from '../actions/auth.actions';
import { tap } from 'rxjs/operators';

@Injectable()
export class RouteEffects {
  gohome$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromAuthActions.logout),
        tap(() => this.router.navigate(['/auth/login']))
      ),
    { dispatch: false }
  );

  loginFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromAuthActions.loginFailure),
        tap(() => this.router.navigate(['/auth/login']))
      ),
    { dispatch: false }
  );

  loginSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromAuthActions.loginSuccess,
          fromAuthActions.registerSuccess),
        tap(() => this.router.navigate(['/dashboard']))
      );
    },
    { dispatch: false }
  );

  constructor(private actions$: Actions, private router: Router) {}
}
