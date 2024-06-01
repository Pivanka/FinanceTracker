import { createReducer, on } from '@ngrx/store';
import * as SettingsActions from "./settings.actions";
import { ProfileSettingsModel } from '../models/profile-settings';
import { error } from 'highcharts';
import { ValidationErrors } from '@angular/forms';

export const settingsFeatureKey = 'settings';

export interface State {
  passwordErrors: ValidationErrors | null,
  isModalLoading: boolean,
  userSettings: ProfileSettingsModel | null,
  currency: string | null
}

export const initialState: State = {
  passwordErrors: [],
  isModalLoading: false,
  userSettings: null,
  currency: null
};

export const reducer = createReducer(
  initialState,

  on(SettingsActions.changePassword, (state, action) => ({
      ...state,
      isModalLoading: true,
    })
  ),

  on(SettingsActions.changePasswordSuccess, (state, action) => ({
      ...state,
      isModalLoading: false,
      passwordErrors: null,
    })
  ),

  on(SettingsActions.changePasswordFailure, (state, action) => ({
      ...state,
      isModalLoading: false,
      passwordErrors: action.error,
    })
  ),

  on(SettingsActions.loadUserSettingsSuccess, (state, action) => ({
      ...state,
      userSettings: action.settings,
      error: null,
    })
  ),
  on(SettingsActions.loadUserSettingsFailed, (state, action) => ({
      ...state,
      error: action.error,
    })
  ),

  on(SettingsActions.updateProfileSettingsFailed, (state, action) => ({
      ...state,
      error: action.error,
    })
  ),

  on(SettingsActions.getCurrencySuccess, (state, action) => ({
      ...state,
      currency: action.currency,
    })
  ),
  on(SettingsActions.getCurrencyFailed, (state, action) => ({
      ...state,
      error: action.error,
    })
  ),
);
