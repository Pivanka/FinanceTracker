import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { BalanceComponent } from './balance/balance.component';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactionItemComponent } from './transactions/transaction-item/transaction-item.component';
import { TransactionModalSearchComponent } from './transactions/transaction-modal-search/transaction-modal-search.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationItemComponent } from './notifications/notification-item/notification-item.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as DashboardReducer from './resources/state/dashboard.reducer';
import { DashboardEffects } from './resources/state/dashboard.effects';
import { SharedModule } from '../../shared/shared.module';
import { NotificationsModalSearchComponent } from './notifications/notifications-modal-search/notifications-modal-search.component';
import { NotificationModalComponent } from './notifications/notification-modal/notification-modal.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  { path: '', component: DashboardComponent }
];

@NgModule({
  imports: [
    StoreModule.forFeature(
      DashboardReducer.dashboardFeatureKey,
      DashboardReducer.reducer
    ),
    EffectsModule.forFeature([DashboardEffects]),
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    DashboardComponent,
    BalanceComponent,
    TransactionsComponent,
    TransactionItemComponent,
    TransactionModalSearchComponent,
    NotificationsComponent,
    NotificationItemComponent,
    NotificationsModalSearchComponent,
    NotificationModalComponent,
  ]
})
export class DashboardModule { }
