import {  createReducer, on } from '@ngrx/store';

import * as DashboardActions from './dashboard.actions';
import { Balance } from '../models/balance';
import { Transaction } from '../models/transaction';
import { PaginatedList } from '../../../../shared/models/paginated-list';
import { Notification } from '../models/notification';

export const dashboardFeatureKey = 'dashboard';

export interface State {
  // dashboard component
  balance: Balance;
  transactions: PaginatedList<Transaction> | null;
  actionsFailureMessage: any;
  notifications: PaginatedList<Notification> | null;

  // modals
  foundTransactions: PaginatedList<Transaction> | null;
  foundTransactionsFailureMessage: any;
  foundTransactionsLoading: boolean;
  foundNotifications: PaginatedList<Notification> | null;
  foundNotificationsFailureMessage: any;
  foundNotificationsLoading: boolean;

  isUnreadNotificationExist: boolean
}

export const initialState: State = {
  balance: {
    incomes: 0,
    expenses: 0,
    currency: ''
  },
  transactions: null,
  notifications: null,
  actionsFailureMessage: null,

  foundTransactions: null,
  foundTransactionsLoading: false,
  foundTransactionsFailureMessage: null,
  foundNotifications: null,
  foundNotificationsLoading: false,
  foundNotificationsFailureMessage: null,

  isUnreadNotificationExist: false
};

export const reducer = createReducer(
  initialState,
  on(DashboardActions.loadBalanceSuccess, (state, action) => ({
      ...state,
      balance: action.result,
      actionsFailureMessage: null
    })
  ),
  on(
    DashboardActions.loadBalanceFailure, (state, action) => ({
      ...state,
      actionsFailureMessage: action.error,
      balance: initialState.balance
    })
  ),

  on(DashboardActions.loadTransactionsSuccess, (state, action) => ({
      ...state,
      transactions: action.result,
      actionsFailureMessage: null
    })
  ),
  on(
    DashboardActions.loadTransactionsFailure, (state, action) => ({
      ...state,
      actionsFailureMessage: action.error,
      transactions: null//think about it
    })
  ),

  // modals
  on(
    DashboardActions.findTransactions, (state, action) => ({
      ...state,
      foundTransactionsLoading: true,
      foundTransactionsFailureMessage: null,
    })
  ),
  on(
    DashboardActions.findTransactionsSuccess, (state, action) => ({
      ...state,
      foundTransactions: action.result,
      foundTransactionsLoading: false,
      foundTransactionFailureMessage: null,
    })
  ),
  on(
    DashboardActions.findTransactionsFailed, (state, action) => ({
      ...state,
      foundTransactionsLoading: false,
      foundTransactionFailureMessage: action.error,
    })
  ),

  on(DashboardActions.loadNotificationsSuccess, (state, action) => ({
      ...state,
      notifications: action.result,
      notificationsFailureMessage: null
    })
  ),
  on(
    DashboardActions.loadNotificationsFailure, (state, action) => ({
      ...state,
      notificationsFailureMessage: action.error,
    })
  ),

  on(
    DashboardActions.findNotifications, (state, action) => ({
      ...state,
      foundNotificationsLoading: true,
      foundNotificationsFailureMessage: null,
    })
  ),
  on(
    DashboardActions.findNotificationsSuccess, (state, action) => ({
      ...state,
      foundNotifications: action.result,
      foundNotificationsLoading: false,
      foundNotificationsFailureMessage: null,
    })
  ),
  on(
    DashboardActions.findNotificationsFailed, (state, action) => ({
      ...state,
      foundNotificationsLoading: false,
      foundNotificationsFailureMessage: action.error,
    })
  ),

  on(
    DashboardActions.isUnreadNotififcationsSuccess, (state, action) => ({
      ...state,
      isUnreadNotificationExist: action.isUnread,
    })
  ),
  on(
    DashboardActions.isUnreadNotififcationsFailed, (state, action) => ({
      ...state,
      isUnreadNotificationExist: false,
    })
  ),

);
