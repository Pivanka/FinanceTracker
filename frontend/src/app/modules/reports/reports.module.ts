import { NgModule } from '@angular/core';
import { ReportsComponent } from './reports.component';
import { SharedModule } from '../../shared/shared.module';
import * as ReportsReducer from './resources/state/reports.reducer';
import { ReportsEffects } from './resources/state/reports.effects';
import { SimpleChartExampleComponent } from './simple-chart-example/simple-chart-example.component';
import { RouterModule, RouterOutlet, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CommonModule } from '@angular/common';
import { IncomesReportsComponent } from './incomes-reports/incomes-reports.component';
import { ExpencesReportsComponent, MY_FORMATS } from './expences-reports/expences-reports.component';
import { DateItemComponent } from '../../shared/date-item/date-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDialogModule } from '@angular/material/dialog';
import { ChartModule } from 'angular-highcharts';
import { BudgetOptimizingComponent } from './budget-optimizing/budget-optimizing.component';
import { TransactionsModule } from '../transactions/transactions.module';
import { AccountDropdownComponent } from './account-dropdown/account-dropdown.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'income-report',
    pathMatch: 'full'
  },
  {
    path: '',
    component: ReportsComponent,
    children: [
      { path: 'income-report', component: IncomesReportsComponent },
      { path: 'expense-report', component: ExpencesReportsComponent },
      { path: 'optimizing', component: BudgetOptimizingComponent },
    ],
  },
];

@NgModule({
  imports: [
    StoreModule.forFeature(
      ReportsReducer.reportsFeatureKey,
      ReportsReducer.reducer
    ),
    EffectsModule.forFeature([ReportsEffects]),
    CommonModule,
    SharedModule,
    RouterOutlet,
    ChartModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  declarations: [
    ReportsComponent,
    IncomesReportsComponent,
    ExpencesReportsComponent,
    SimpleChartExampleComponent,
    DateItemComponent,
    BudgetOptimizingComponent,
    AccountDropdownComponent
  ],
  providers: [
    provideMomentDateAdapter(MY_FORMATS),
  ],
})
export class ReportsModule { }
