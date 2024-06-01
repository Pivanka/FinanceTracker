import { NgModule } from '@angular/core';
import { AllTransactionsComponent } from './all-transactions/all-transactions.component';
import { SharedModule } from '../../shared/shared.module';
import { TransactionsTableWrapperComponent } from './transactions-table-wrapper/transactions-table-wrapper.component';
import { AllAccountsDropdownComponent } from './all-accounts-dropdown/all-accounts-dropdown.component';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions.component';
import { MatMenuModule } from '@angular/material/menu';
import { AddTransactionModalComponent } from './add-transaction-modal/add-transaction-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryDropdownComponent } from './add-transaction-modal/category-dropdown/category-dropdown.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as TransactionsReducer from './resources/state/transactions.reducer';
import { TransactionsEffects } from './resources/state/transactions.effects';
import { EditTransactionModalComponent } from './edit-transaction-modal/edit-transaction-modal.component';
import { IncomesComponent } from './incomes/incomes.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { TransactionsTableComponent } from './transactions-table/transactions-table.component';
import { CommonModule } from '@angular/common';
import { UploadTransactionModalComponent } from './upload-transaction-modal/upload-transaction-modal.component';
import { UploadTransactionsConfirmModalComponent } from './upload-transactions-confirm-modal/upload-transactions-confirm-modal.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'all',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TransactionsComponent,
    children: [
      { path: 'all', component: AllTransactionsComponent },
      { path: 'incomes', component: IncomesComponent },
      { path: 'expenses', component: ExpensesComponent },
    ],
  },
];

@NgModule({
  imports: [
    StoreModule.forFeature(
      TransactionsReducer.transactionsFeatureKey,
      TransactionsReducer.reducer
    ),
    EffectsModule.forFeature([TransactionsEffects]),
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    TransactionsComponent,
    AllTransactionsComponent,
    TransactionsTableWrapperComponent,
    AllAccountsDropdownComponent,
    AddTransactionModalComponent,
    CategoryDropdownComponent,
    EditTransactionModalComponent,
    AllAccountsDropdownComponent,
    IncomesComponent,
    ExpensesComponent,
    TransactionsTableComponent,
    UploadTransactionModalComponent,
    UploadTransactionsConfirmModalComponent,
  ],
  exports: [
    CategoryDropdownComponent
  ],
  bootstrap: [TransactionsComponent],
})
export class TransactionsModule { }
