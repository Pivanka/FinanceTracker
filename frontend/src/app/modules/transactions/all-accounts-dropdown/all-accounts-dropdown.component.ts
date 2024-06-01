import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountModel } from '../resources/models/account-model';
import { Store, select } from '@ngrx/store';
import { selectAccountInfo } from '../resources/state/transactions.selector';
import { loadPaginatedTransactions, loadPaginatedTransactionsCount, setFilterTransactions } from '../resources/state/transactions.actions';
import { Filter, FilterType } from '../../../shared/models/query-params';
import { AppState } from '../../../store';

@Component({
  selector: 'app-all-accounts-dropdown',
  templateUrl: './all-accounts-dropdown.component.html',
  styleUrls: ['./all-accounts-dropdown.component.scss']
})
export class AllAccountsDropdownComponent implements OnInit {

  isSelectListOpen: boolean = false;
  private _value: string = 'All accounts';
  currentFilter$!: Observable<number | string | undefined>;
  accountsInfo$!: Observable<AccountModel[] | null>

  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val;
    this._onChange(this._value);
  }

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
    this.accountsInfo$ = this.store.pipe(select(selectAccountInfo));
  }

  writeValue(value: any): void {
    this.value = value;
  }

  private _onChange(_: any) { }
  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(): void { }

  openSelectList() {
    this.isSelectListOpen = !this.isSelectListOpen;
  }

  closeSelectList() {
    this.isSelectListOpen = false;
  }

  updateList(el: string | AccountModel | undefined) {
    this.isSelectListOpen = false;
    const prevValue = this.value;

    let filter: string = '';
    if (typeof el === 'string') {
      this.value = el as string;
      filter = el as string;
    }
    else if (el != undefined) {
      this.value = (el as AccountModel).title;
      filter = (el as AccountModel).id.toString();
    }
    if (prevValue == this.value) {
      this.value = 'All accounts';
      filter = '';
    }

    let filters: Filter[] = [
      {
        key: "account",
        value: filter,
        filterType: FilterType.equals
      }
    ]
    this.store.dispatch(setFilterTransactions({ filter : filters }));
    this.store.dispatch(loadPaginatedTransactions());
    this.store.dispatch(loadPaginatedTransactionsCount());
  }

  getName(item: string | AccountModel) {
    if (typeof item === 'string') {
      return item;
    }

    return item.title;
  }

  keyEqual(item: string | AccountModel) {
    if (typeof item == 'string') {
      return (item as string) === this.value;
    }

    return (item as AccountModel).title === this.value;
  }

  calculate(models: AccountModel[] | null) {
    if(!models){
      return 0;
    }
    return models.reduce((total, item) => total + item.transactionsCount, 0)
  }
}
