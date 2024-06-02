import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Filter, FilterType } from '../../../shared/models/query-params';
import { AppState } from '../../../store';
import { Account } from '../../transactions/resources/models/account-model';
import { setFilterTransactions, loadPaginatedTransactions, loadPaginatedTransactionsCount } from '../../transactions/resources/state/transactions.actions';
import { selectAccounts } from '../../transactions/resources/state/transactions.selector';
import { TransactionType } from '../../dashboard/resources/models/transaction';
import { loadChart } from '../resources/state/reports.actions';

@Component({
  selector: 'app-account-dropdown',
  templateUrl: './account-dropdown.component.html',
  styleUrls: ['./account-dropdown.component.scss']
})
export class AccountDropdownComponent implements OnInit {

  isSelectListOpen: boolean = false;
  private _value: string = 'All accounts';
  accounts$: Observable<Account[]>;
  @Output() selectedAccount = new EventEmitter<string>();

  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val;
    this._onChange(this._value);
  }

  constructor(private store: Store<AppState>) {
    this.accounts$ = store.select(selectAccounts);
  }

  ngOnInit() {
  }


  private _onChange(_: any) { }

  openSelectList() {
    this.isSelectListOpen = !this.isSelectListOpen;
  }

  closeSelectList() {
    this.isSelectListOpen = false;
  }

  updateList(el:  Account | undefined) {
    this.isSelectListOpen = false;
    const prevValue = this.value;

    let filter: string = '';
    if (typeof el === 'string') {
      this.value = el as string;
      filter = el as string;
    }
    else if (el != undefined) {
      this.value = (el as Account).title;
      filter = (el as Account).id.toString();
    }
    if (prevValue == this.value) {
      this.value = 'All accounts';
      filter = '';
    }

    this.selectedAccount.emit(filter);
  }

  getName(item: string | Account) {
    if (typeof item === 'string') {
      return item;
    }

    return item.title;
  }

  keyEqual(item: string | Account) {
    if (typeof item == 'string') {
      return (item as string) === this.value;
    }

    return (item as Account).title === this.value;
  }

}
