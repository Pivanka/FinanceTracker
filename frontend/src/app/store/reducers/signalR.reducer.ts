import { createReducer, on } from "@ngrx/store";
import * as SignalRActions from "../actions/signalR.actions";

export const signalRFeatureKey = 'signalR';

export interface State {
  connected: boolean;
  error: any;
}

export const initialState: State = {
  connected: false,
  error: null
};
export const reducer = createReducer(
  initialState,
  on(SignalRActions.connectionEstablished, (state) => ({ ...state, connected: true })),
  on(SignalRActions.connectionFailed, (state, { error }) => ({ ...state, connected: false, error })),
  on(SignalRActions.disconnectSignalR, () => ({ ...initialState })),
);
