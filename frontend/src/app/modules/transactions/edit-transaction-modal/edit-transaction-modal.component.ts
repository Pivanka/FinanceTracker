import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';

import { Transaction, TransactionType } from '../../dashboard/resources/models/transaction';
import { AddMemberModalComponent } from '../../general/members/add-member-modal/add-member-modal.component';
import { Account } from '../resources/models/account-model';
import { Category } from '../resources/models/category';
import { editTransaction } from '../resources/state/transactions.actions';
import { selectAccounts, showCategoriesSelector } from '../resources/state/transactions.selector';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../core/resources/services/api.service';
import { AppState } from '../../../store';
import { Role } from '../../auth/resources/models/role';
import { selectRole } from '../../settings/resources/state/settings.selector';


export interface EditTransaction{
  id: number,
  note: string | null,
  amount: number,
  type: TransactionType,
  currency: string,
  categoryId: number
  accountId: number
}

@Component({
  selector: 'app-edit-transaction-modal',
  templateUrl: './edit-transaction-modal.component.html',
  styleUrls: ['./edit-transaction-modal.component.scss']
})
export class EditTransactionModalComponent implements OnInit {

  transactionForm!: FormGroup;
  categories$?: Observable<Category[] | undefined>;
  accounts$: Observable<Account[]>;
  hasAccess$!: Observable<boolean | null>;

  constructor(private service: ApiService,
    public dialogRef: MatDialogRef<AddMemberModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Transaction,
    private store: Store<AppState>) {
      this.accounts$ = store.select(selectAccounts);
      this.hasAccess$ = this.store.pipe(select(selectRole)).pipe(
        map(role => role == Role.Admin || role == Role.Manager));
  }

  ngOnInit(): void {
    this.transactionForm = new FormGroup({
      type: new FormControl(this.transactionType, [Validators.required]),
      notes: new FormControl(this.data.note),
      amount: new FormControl(this.data.amount, [Validators.required]),
      currency: new FormControl(this.data.currency, [Validators.required]),
      category: new FormControl(this.data.category, [Validators.required]),
      account: new FormControl(this.data.account, [Validators.required]),
    });
    this.getCategories(this.data.type);
  }

  onSubmit() {
    var result: EditTransaction = {
      id: this.data.id,
      note: this.transactionForm.controls['notes'].value,
      type: this.transactionForm.controls['type'].value === 'Expense' ? TransactionType.Expense : TransactionType.Income,
      amount: this.transactionForm.controls['amount'].value,
      currency: this.transactionForm.controls['currency'].value,
      categoryId: this.transactionForm.controls['category'].value.id,
      accountId: this.transactionForm.controls['account'].value.id
    }

    this.store.dispatch(editTransaction({ transaction: result }));
  }

  getFormControl(controlName: string): FormControl {
    return this.transactionForm?.get(controlName) as FormControl;
  }

  get transactionType() {
    if(this.data.type === TransactionType.Expense) return 'Expense'
    return 'Income';
  }

  getCategories(type: TransactionType) {
    this.categories$ = this.store.pipe(
      select(showCategoriesSelector(type, ''))
    );
  }
}
