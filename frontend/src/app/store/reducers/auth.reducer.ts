import { createReducer, on } from '@ngrx/store';
import * as fromAuthActions from '../actions/auth.actions';
import { User } from '../../modules/auth/resources/models/user';
import { ValidationErrors } from '@angular/forms';

export const authFeatureKey = 'auth';

export interface State {
  user: User | null;
  error: ValidationErrors | null;
  isLoggedIn: boolean | null;
}

export const initialState: State = {
  user: null,
  error: null,
  isLoggedIn:null,
};

export const reducer = createReducer(
  initialState,

  on(fromAuthActions.loginSuccess, (state, action) => {
    return {
      ...state,
      error: null,
      isLoggedIn:true,
    };
  }),
  on(fromAuthActions.loginFailure, (state, action) => {
    return {
      ...state,
      user: null,
      error: action.error,
      isLoggedIn:false,
    };
  }),
  on(fromAuthActions.logout, (state) => {
    return {
      ...state,
      user: null,
      error: null,
      isLoggedIn: false
    };
  }),
  //useless
  on(fromAuthActions.backToLoginPage, (state) => {
    return {
      ...state,
      user: null,
      error: null,
      isLoggedIn:false,
      twoFactorCodeRequired: false,
    };
  }),
  on(fromAuthActions.registerSuccess, (state, action) => {
    return {
      ...state,
      error: null,
      isLoggedIn:true,
    };
  }),
  on(fromAuthActions.redgisterFailure, (state, action) => {
    return {
      ...state,
      user: null,
      error: action.error,
      isLoggedIn:false,
    };
  }),
);
