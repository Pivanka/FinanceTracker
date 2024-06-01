import { createAction, props } from '@ngrx/store';
import { Balance } from '../models/balance';
import { Transaction } from '../models/transaction';
import { PaginatedList } from '../../../../shared/models/paginated-list';
import { Notification } from '../models/notification';

// load balance
export const loadBalance = createAction(
  '[Dashboard Component] Load Balance'
);

export const loadBalanceSuccess = createAction(
  '[Dashboard Effects] Load Balance Success',
  props<{ result: Balance }>()
);

export const loadBalanceFailure = createAction(
  '[Dashboard Effects] Load Balance Failure',
  props<{ error: any }>()
);

// load transactions
export const loadTransactions = createAction(
  '[Dashboard Component] Load Transactions',
  props<{ take: number }>()
);

export const loadTransactionsSuccess = createAction(
  '[Dashboard Effects] Load Transactions Success',
  props<{ result: PaginatedList<Transaction> | null }>()
);

export const loadTransactionsFailure = createAction(
  '[Dashboard Effects] Load Transactions Failure',
  props<{ error: any }>()
);

export const openTransactionsModal = createAction(
  '[Dashboard Component] Open Transactions Modal'
);

export const findTransactions = createAction(
  '[Dashboard Modal Transactions Component] Load Transactions',
  props<{ searchString?: string, isDescending: boolean, days?: number, page: number, take: number }>()
);

export const findTransactionsSuccess = createAction(
  '[Dashboard Effects] Find Transactions Success',
  props<{ result: PaginatedList<Transaction> | null }>()
);

export const findTransactionsFailed = createAction(
  '[Dashboard Effects] Find Transactions Failed',
  props<{ error: any }>()
);

// load notifications
export const loadNotifications = createAction(
  '[Dashboard Component] Load Notifications',
  props<{ take: number }>()
);

export const loadNotificationsSuccess = createAction(
  '[Dashboard Effects] Load Notifications Success',
  props<{ result: PaginatedList<Notification> | null }>()
);

export const loadNotificationsFailure = createAction(
  '[Dashboard Effects] Load Notifications Failure',
  props<{ error: any }>()
);

export const findNotifications = createAction(
  '[Dashboard Modal Notifications Component] Load Notifications',
  props<{ searchString?: string, isDescending: boolean, days?: number, page: number, take: number }>()
);

export const findNotificationsSuccess = createAction(
  '[Dashboard Effects] Find Notifications Success',
  props<{ result: PaginatedList<Notification> | null }>()
);

export const findNotificationsFailed = createAction(
  '[Dashboard Effects] Find Notifications Failed',
  props<{ error: any }>()
);

export const openNotificationsModal = createAction(
  '[Dashboard Component] Open Notifications Modal'
);

export const isUnreadNotififcations = createAction(
  '[Dashboard Component] Is Unread Notifications'
);
export const isUnreadNotififcationsSuccess = createAction(
  '[Dashboard Component] Is Unread Notifications Success',
  props<{ isUnread: boolean }>()
);
export const isUnreadNotififcationsFailed = createAction(
  '[Dashboard Component] Is Unread Notifications Failure',
  props<{ error: any }>()
);


export const readNotififcation = createAction(
  '[Dashboard Component] Read Notification',
  props<{ notificationId: number }>()
);
export const readNotififcationSuccess = createAction(
  '[Dashboard Component] Read Notification Success'
);
export const readNotififcationFailure = createAction(
  '[Dashboard Component] Read Notification Failure',
  props<{ error: any }>()
);
