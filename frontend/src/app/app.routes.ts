import { Routes } from '@angular/router';
import { ShellComponent } from './core/modules/shell/shell.component';
import { canActivate, canActivateChild } from './modules/auth/resources/services/auth.guard';
import { SettingsComponent } from './modules/settings/settings.component';

export const routes: Routes = [
  {
    path: '',
    canActivate:[canActivate],
    canActivateChild: [canActivateChild],
    component: ShellComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          )
      },
      {
        path: 'general',
        loadChildren: () =>
          import('./modules/general/general.module').then(
            (m) => m.GeneralModule
          ),
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'transactions',
        loadChildren: () =>
          import('./modules/transactions/transactions.module').then(
            (m) => m.TransactionsModule
          ),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./modules/reports/reports.module').then(
            (m) => m.ReportsModule
          ),
      },
    ]
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
];
