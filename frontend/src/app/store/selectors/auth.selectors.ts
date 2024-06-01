import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from '../reducers/auth.reducer';
import { User } from '../../modules/auth/resources/models/user';
import { Role } from '../../modules/auth/resources/models/role';


export const selectAuthState = createFeatureSelector<fromAuth.State>(
  fromAuth.authFeatureKey
);

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state: fromAuth.State): boolean | null => state.isLoggedIn
);

export const selectUser = createSelector(
  selectAuthState,
  (state: fromAuth.State): User | null => state.user
);

export const selectErrors = createSelector(
  selectAuthState,
  (state: fromAuth.State) => state.error
)
