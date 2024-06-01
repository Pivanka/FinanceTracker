import { createReducer, on } from '@ngrx/store';
import * as fromSpinnerActions from '../actions/spinner.actions';

export const spinnerFeatureKey = 'spinner';

export interface State {
    show: boolean;
}

const initialState: State = {
    show: false
};

export const reducer = createReducer(
    initialState,

    on(fromSpinnerActions.showSpinner, (state) => {
        return {
            ...state,
            show: true
        };
    }),
    on(fromSpinnerActions.hideSpinner, (state) => {
        return {
            ...state,
            show: false
        };
    }),
);

export const isShowing = (state: State) => state.show;
