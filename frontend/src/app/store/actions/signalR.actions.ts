import { createAction, props } from "@ngrx/store";

export const connectSignalR = createAction('[SignalR] Connect');
export const disconnectSignalR = createAction('[SignalR] Disconnect');
export const connectionEstablished = createAction('[SignalR] Connection Established');
export const connectionFailed = createAction('[SignalR] Connection Failed', props<{ error: any }>());
export const receiveMessage = createAction('[SignalR] Receive Message', props<{ message: string }>());
