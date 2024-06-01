import {
    ActionReducer,
    ActionReducerMap,
    MetaReducer,
  } from '@ngrx/store';
  import { environment } from '../../environments/environment';
  import * as fromAuth from './reducers/auth.reducer';
  import * as fromRouter from '@ngrx/router-store';
  import * as fromSpinner from './reducers/spinner.reducer';
  import * as fromSignalR from './reducers/signalR.reducer';

  export interface AppState {
    router: fromRouter.RouterReducerState;
    [fromAuth.authFeatureKey]: fromAuth.State;
    [fromSpinner.spinnerFeatureKey]: fromSpinner.State;
    [fromSignalR.signalRFeatureKey]: fromSignalR.State;
  }

  export const reducers: ActionReducerMap<AppState> = {
    router: fromRouter.routerReducer,
    [fromAuth.authFeatureKey]: fromAuth.reducer,
    [fromSpinner.spinnerFeatureKey]: fromSpinner.reducer,
    [fromSignalR.signalRFeatureKey]: fromSignalR.reducer
  };

  export const metaReducers: MetaReducer<AppState>[] = !environment.production
    ? [debug]
    : [];

  export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
    return function (state, action) {
      //console.log('state', state);
      //console.log('action', action);

      return reducer(state, action);
    };
  }
