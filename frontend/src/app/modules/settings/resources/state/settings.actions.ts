import { createAction, props } from "@ngrx/store";
import { PasswordSettingsModel } from "../../password-settings/change-password-modal/change-password-modal.component";
import { ProfileSettingsModel, SettingsModel } from "../models/profile-settings";

//change password
export const changePassword = createAction(
  '[Settings Component] Change Password',
  props<{ settings: PasswordSettingsModel }>()
);

export const changePasswordSuccess = createAction(
  '[Settings Effects] Change Password Success'
);

export const changePasswordFailure = createAction(
  '[Settings Effects] Change Password Failure',
  props<{ error: string[] }>()
);

//load settings
export const loadUserSettings = createAction(
  '[Settings Component] Load Settings'
);

export const loadUserSettingsSuccess = createAction(
  '[Settings Effects] Load Settings Success',
  props<{ settings: ProfileSettingsModel }>()
);

export const loadUserSettingsFailed = createAction(
  '[Settings Effects] Load Settings Failed',
  props<{ error: any }>()
);

//update settings
export const updateProfileSettings = createAction(
  '[Settings Component] Update Settings',
  props<{ settings: SettingsModel }>()
);

export const updateProfileSettingsSuccess = createAction(
  '[Settings Effects] Update Settings Success',
);

export const updateProfileSettingsFailed = createAction(
  '[Settings Effects] Update Settings Failed',
  props<{ error: any }>()
);

//load settings
export const getCurrency = createAction(
  '[Settings Component] Get Currency'
);

export const getCurrencySuccess = createAction(
  '[Settings Effects] Get Currency Success',
  props<{ currency: string }>()
);

export const getCurrencyFailed = createAction(
  '[Settings Effects] Get Currency Failed',
  props<{ error: any }>()
);

//change currency
export const changeCurrency = createAction(
  '[Settings Component] Change Currency',
  props<{ currency: string }>()
);

export const changeCurrencySuccess = createAction(
  '[Settings Effects] Change Currency Success'
);

export const changeCurrencyFailure = createAction(
  '[Settings Effects] Change Currency Failure',
  props<{ error: string[] }>()
);
