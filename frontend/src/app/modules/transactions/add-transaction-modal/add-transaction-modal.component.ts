import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TransactionType } from '../../dashboard/resources/models/transaction';
import { Category, CustomCategory } from '../resources/models/category';
import { Account } from '../resources/models/account-model';
import { Store, select } from '@ngrx/store';
import { AddMemberModalComponent } from '../../general/members/add-member-modal/add-member-modal.component';
import { addTransaction, calculateAmount } from '../resources/state/transactions.actions';
import { Observable, Subscription } from 'rxjs';
import { selectAccounts, selectAmount, selectCurrencies, showCategoriesSelector, showCustomCategoriesSelector } from '../resources/state/transactions.selector';
import { CalculateRateRequest, CalculatedAmount, CurrencyModel } from '../resources/models/currency';
import { CategoryDropdownComponent } from '../../../shared/category-dropdown/category-dropdown.component';
import { AppState } from '../../../store';

export interface AddTransaction{
  note: string | null,
  amount: number,
  type: TransactionType,
  currency: string,
  categoryId?: number,
  customCategoryId?: number,
  accountId: number,
  exchangeRate?: number,
  date?: Date
}
@Component({
  selector: 'app-add-transaction-modal',
  templateUrl: './add-transaction-modal.component.html',
  styleUrls: ['./add-transaction-modal.component.scss']
})
export class AddTransactionModalComponent implements OnInit, OnDestroy {

  transactionForm!: FormGroup;
  categories$?: Observable<Category[] | undefined>;
  customCategories$?: Observable<CustomCategory[] | undefined>;
  accounts$: Observable<Account[]>;
  currencies$: Observable<CurrencyModel[]>;
  subscription?: Subscription;

  @ViewChild(CategoryDropdownComponent) categoryDropdown!: CategoryDropdownComponent;

  constructor(public dialogRef: MatDialogRef<AddMemberModalComponent>,
    private store: Store<AppState>) {
    this.accounts$ = store.select(selectAccounts);
    this.currencies$ = store.select(selectCurrencies);
  }

  ngOnInit(): void {
    this.transactionForm = new FormGroup({
      type: new FormControl('Expense', [Validators.required]),
      notes: new FormControl(''),
      amount: new FormControl(0, [Validators.required]),
      currency: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      account: new FormControl('', [Validators.required]),
      date: new FormControl(null),
    });
    this.getCategories(this.transactionType?.value);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onSubmit() {
    var result: AddTransaction = {
      note: this.transactionForm.controls['notes'].value,
      type: this.transactionForm.controls['type'].value === 'Expense' ? TransactionType.Expense : TransactionType.Income,
      amount: this.transactionForm.controls['amount'].value,
      currency: this.transactionForm.controls['currency'].value.currency,
      accountId: this.transactionForm.controls['account'].value.id,
      exchangeRate: 1,
      date: this.transactionForm.controls['date'].value
    };

    if(this.transactionForm.controls['category'].value.teamId > 0) {
      result.customCategoryId = this.transactionForm.controls['category'].value.id;
    } else {
      result.categoryId = this.transactionForm.controls['category'].value.id
    }
    this.store.dispatch(addTransaction({ transaction: result }));
  }

  getFormControl(controlName: string): FormControl {
    return this.transactionForm?.get(controlName) as FormControl;
  }

  selectType(type: string) {
    this.getCategories(type);
    this.transactionForm?.get('type')?.setValue(type);
    this.categoryDropdown.clearSelection();
  }

  get transactionType() {
    return this.transactionForm.get('type');
  }

  getCategories(type: string) {
    var transactionType = 'Expense' === type ? TransactionType.Expense : TransactionType.Income;

    this.categories$ = this.store.pipe(
      select(showCategoriesSelector(transactionType, ''))
    );
    this.customCategories$ = this.store.pipe(
      select(showCustomCategoriesSelector(transactionType, ''))
    )
  }


  selectCurrency(event?: any) {
    var accountCurrency = this.transactionForm.controls['account'].value.currency;

    if(accountCurrency !== event.currency) {
      this.calculateAmount();
    } else {
      this.amount$ = new Observable<CalculatedAmount | undefined>;
    }
  }

  selectAccount(event?: any) {
    var currency = this.transactionForm.controls['currency'].value.currency;

    if(currency !== event.currency) {
      this.calculateAmount();
    } else {
      this.amount$ = new Observable<CalculatedAmount | undefined>;
    }
  }

  amount$?: Observable<CalculatedAmount | undefined>;
  calculateAmount(){
    var amount = this.transactionForm.controls['amount'].value;

    if(amount > 0){

      var request: CalculateRateRequest = {
        accountCurrency: this.transactionForm.controls['account'].value.currency,
        selectedCurrency: this.transactionForm.controls['currency'].value.currency,
        amount: amount
      }

      this.store.dispatch(calculateAmount({request: request}));
      this.amount$ = this.store.select(selectAmount);
    }
  }

  changeAmount() {
    var currency = this.transactionForm.controls['currency'].value.currency;
    var accountCurrency = this.transactionForm.controls['account'].value.currency;

    if(currency !== accountCurrency) {
      this.calculateAmount();
    }
  }
}
