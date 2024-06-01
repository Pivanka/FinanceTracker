import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as DashboardReducer from './dashboard.reducer';

export const selectDashboardState = createFeatureSelector<DashboardReducer.State>(
  DashboardReducer.dashboardFeatureKey
);

export const selectBalance = createSelector(
  selectDashboardState,
  state => state.balance
);

export const selectTransactions = createSelector(
  selectDashboardState,
  state => state.transactions
);

export const selectFoundTransactions = createSelector(
  selectDashboardState,
  state => state.foundTransactions
);

export const selectFoundTransactionsLoading = createSelector(
  selectDashboardState,
  state => state.foundTransactionsLoading
);

export const selectNotifications = createSelector(
  selectDashboardState,
  state => state.notifications
);

export const selectFoundNotifications = createSelector(
  selectDashboardState,
  state => state.foundNotifications
);

export const selectAnyUnredNotification = createSelector(
  selectDashboardState,
  state => state.isUnreadNotificationExist
);
