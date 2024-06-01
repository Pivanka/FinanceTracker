import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as DashboardActions from './dashboard.actions';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DashboardService } from "../services/dashboard.service";
import { MatDialog } from "@angular/material/dialog";
import { Balance } from '../models/balance';
import { TransactionModalSearchComponent } from '../../transactions/transaction-modal-search/transaction-modal-search.component';
import { NotificationsModalSearchComponent } from '../../notifications/notifications-modal-search/notifications-modal-search.component';
import { openNotificationModal } from '../../../../store/actions/modal.actions';
import { NotificationModalComponent } from '../../notifications/notification-modal/notification-modal.component';

@Injectable()
export class DashboardEffects {
  loadActions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DashboardActions.loadBalance),
      mergeMap((action) =>
        this.dashboardService.get<Balance>('/api/dashboard').pipe(
          map((data) =>
            DashboardActions.loadBalanceSuccess({ result: data })
          ),
          catchError((error) =>
            of(DashboardActions.loadBalanceFailure({error: error.status}))
          )
        )
      )
    );
  });

  loadTransactions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DashboardActions.loadTransactions),
      mergeMap((action) =>
        this.dashboardService.getTransactions$(1, action.take, "", true, undefined).pipe(
          map((data) =>
            DashboardActions.loadTransactionsSuccess({ result: data })
          ),
          catchError((error) =>
            of(DashboardActions.loadTransactionsFailure({error:error.status}))
          )
        )
      )
    );
  });

  openTransactionsModalSearch$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DashboardActions.openTransactionsModal),
        tap(_ => this.dialog.open(TransactionModalSearchComponent)),
      ),
    { dispatch: false }
  );

  findTransactions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DashboardActions.findTransactions),
      mergeMap((action) =>
        this.dashboardService.getTransactions$(action.page, action.take,action.searchString ?? "",
          action.isDescending, action.days).pipe(
          map((data) =>
            DashboardActions.findTransactionsSuccess({ result: data })
          ),
          catchError((error) =>
            of(DashboardActions.findTransactionsFailed({error:error.status}))
          )
        )
      )
    );
  });

  loadNotifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DashboardActions.loadNotifications),
      mergeMap((action) =>
        this.dashboardService.getNotifications$(1, action.take, "", true, undefined).pipe(
          map((data) =>
            DashboardActions.loadNotificationsSuccess({ result: data })
          ),
          catchError((error) =>
            of(DashboardActions.loadNotificationsFailure({error:error.status}))
          )
        )
      )
    );
  });

  findNotifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DashboardActions.findNotifications),
      mergeMap((action) =>
        this.dashboardService.getNotifications$(action.page, action.take,action.searchString ?? "",
          action.isDescending, action.days).pipe(
          map((data) =>
            DashboardActions.findNotificationsSuccess({ result: data })
          ),
          catchError((error) =>
            of(DashboardActions.findNotificationsFailed({error:error.status}))
          )
        )
      )
    );
  });

  openNotificationsModalSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.openNotificationsModal),
      tap(_ => this.dialog.open(NotificationsModalSearchComponent)),
    ),
    { dispatch: false }
  );

  isUnreadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.isUnreadNotififcations,
        DashboardActions.readNotififcationSuccess
      ),
      mergeMap(() =>
        this.dashboardService.get<boolean>('/api/notification/unread').pipe(
          map((data) =>
            DashboardActions.isUnreadNotififcationsSuccess({ isUnread: data })
          ),
          catchError((error) =>
            of(
              DashboardActions.isUnreadNotififcationsFailed({
                error: error.status,
              })
            )
          )
        )
      )
    )
  );

  notificationModalOpen$ = createEffect(() =>
    () => {
      return this.actions$.pipe(
      ofType(openNotificationModal),
      map((action) => {
        this.dialog.closeAll();
        this.dialog.open(NotificationModalComponent, {
          data: action.notification
        });
      })
    )},
    { dispatch: false }
  )

  readNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.readNotififcation),
      mergeMap((action) =>
        this.dashboardService.post<any>('/api/notification/read', action.notificationId).pipe(
          map(() => DashboardActions.readNotififcationSuccess()),
          catchError((error) =>
            of(
              DashboardActions.readNotififcationFailure({
                error: error.status,
              })
            )
          )
        )
      )
    )
  )

  constructor(
    private actions$: Actions,
    private dashboardService: DashboardService,
    private dialog: MatDialog
  ) {}
}
