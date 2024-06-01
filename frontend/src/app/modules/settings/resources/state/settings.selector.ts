import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as SettingsReducer from "./settings.reducer";
import { ProfileSettingsModel } from "../models/profile-settings";
import { Role } from "../../../auth/resources/models/role";

export const selectSettingsState = createFeatureSelector<SettingsReducer.State>(
  SettingsReducer.settingsFeatureKey,
);

export const isModalLoading = createSelector(
  selectSettingsState,
  state => state.isModalLoading
)

export const selectPasswordErrors = createSelector(
  selectSettingsState,
  state => state.passwordErrors
)

export const selectSettings = createSelector(
  selectSettingsState,
  state => state.userSettings
)

export const selectProfileSettings = createSelector(
  selectSettings,
  state => state
)

export const selectRole = createSelector(
  selectSettings,
  (state): Role => state?.role ?? Role.Empty
);

export const selectCurrency = createSelector(
  selectSettingsState,
  state => state.currency
)
