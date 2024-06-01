import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as GeneralReducer from "./general.reducer";

export const selectGeneralState = createFeatureSelector<GeneralReducer.State>(
  GeneralReducer.generalFeatureKey,
);

export const selectMembers = createSelector(
  selectGeneralState,
  state => state.members
)

export const selectErrors = createSelector(
  selectGeneralState,
  state => state.errors
)

export const selectAccounts = createSelector(
  selectGeneralState,
  state => state.accounts
)

export const selectAccountsCount = createSelector(
  selectAccounts,
  state => state?.length ?? 0
)

export const selectMembersCount = createSelector(
  selectMembers,
  state => state?.length ?? 0
)
