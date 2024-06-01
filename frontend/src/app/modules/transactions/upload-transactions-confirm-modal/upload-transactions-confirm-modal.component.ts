import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ButtonConfig } from '../../../shared/button/button.component';
import { Observable } from 'rxjs';
import { Account } from '../resources/models/account-model';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { selectAccounts } from '../resources/state/transactions.selector';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AddTransaction } from '../add-transaction-modal/add-transaction-modal.component';
import { addTransactions } from '../resources/state/transactions.actions';

export interface RequestConfirmData {
  outlinedButton: ButtonConfig;
  count: number;
}
export interface AddTransactions{
  accountId: number,
  transactions: AddTransaction[]
}

@Component({
  selector: 'app-upload-transactions-confirm-modal',
  templateUrl: './upload-transactions-confirm-modal.component.html',
  styleUrls: ['./upload-transactions-confirm-modal.component.scss']
})
export class UploadTransactionsConfirmModalComponent implements OnInit {

  accounts$?: Observable<Account[]>;
  transactionForm = new FormGroup({
    account: new FormControl(null, [Validators.required]),
  });
  primaryButton: ButtonConfig = { text: 'Approve All', onClick: () => this.approve() }

  constructor(@Inject(MAT_DIALOG_DATA) public data: RequestConfirmData,
              private store: Store<AppState>) { }

  ngOnInit() {
    this.accounts$ = this.store.select(selectAccounts);
  }

  getFormControl(controlName: string): FormControl {
    return this.transactionForm?.get(controlName) as FormControl;
  }

  approve() {
    this.store.dispatch(addTransactions({ accountId: this.getFormControl('account').value.id }));
  }
}
