import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mergeMap, map, catchError, of, tap, from } from "rxjs";
import { SignalRService } from "../../core/resources/services/signalR.service";
import * as SignalRActions from "../actions/signalR.actions";
import { Store } from "@ngrx/store";

@Injectable()
export class SignalREffects {
  constructor(
    private actions$: Actions,
    private signalRService: SignalRService, private store: Store
  ) {}

  connectSignalR$ = createEffect(() => this.actions$.pipe(
    ofType(SignalRActions.connectSignalR),
    mergeMap(() => from(this.signalRService.startConnection())
      .pipe(
        map(() => SignalRActions.connectionEstablished()),
        catchError(error => of(SignalRActions.connectionFailed({ error: error.status })))
      )
    ))
  );

  disconnectSignalR$ = createEffect(() => this.actions$.pipe(
    ofType(SignalRActions.disconnectSignalR),
    tap(() => this.signalRService.stopConnection())
  ), { dispatch: false });
}
