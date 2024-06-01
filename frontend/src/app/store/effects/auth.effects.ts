import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AuthActions from '../actions/auth.actions';
import { LoginResult } from '../../modules/auth/resources/models/login-result';
import { AuthService } from '../../modules/auth/resources/services/auth.service';
import { Store } from '@ngrx/store';
import * as signalRActions from '../actions/signalR.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginPage),
      concatMap((action) =>
        this.authService.post<LoginResult>('/api/auth/login', action.loginRequest).pipe(
          map((loginResult) => {
            this.authService.LogIn(loginResult);
            this.store.dispatch(signalRActions.connectSignalR());
            return AuthActions.loginSuccess({ loginResult: loginResult });
          }),
          catchError((error) => {
            return of(AuthActions.loginFailure({ error: error?.error?.errors ?? {} }))
          }
          )
        )
      )
    );
  });

  loginFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(() => this.authService.LogOut())
      );
    },
    { dispatch: false }
  );

  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.LogOut();
          this.store.dispatch(signalRActions.disconnectSignalR());
        })
      );
    },
    { dispatch: false }
  );

  register$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.register),
      concatMap((action) =>
        this.authService.post<LoginResult>('/api/auth/register', action.request).pipe(
          map((loginResult) => {
            this.authService.LogIn(loginResult);
            return AuthActions.registerSuccess({ result: loginResult });
          }),
          catchError((error) => {
            return of(AuthActions.redgisterFailure({ error: error?.error?.errors ?? {} }))
          }
          )
        )
      )
    );
  });

  constructor(private actions$: Actions, private authService: AuthService, private store: Store) {}
}
