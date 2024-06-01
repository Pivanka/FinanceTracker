import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../resources/models/transaction';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as DashboardReducer from "../../resources/state/dashboard.reducer";
import * as DashboardSelector from "../../resources/state/dashboard.selectors";
import * as fromDashboardActions from "../../resources/state/dashboard.actions";
import { PaginatedList } from '../../../../shared/models/paginated-list';

@Component({
  selector: 'app-transaction-modal-search',
  templateUrl: './transaction-modal-search.component.html',
  styleUrls: ['./transaction-modal-search.component.scss']
})
export class TransactionModalSearchComponent implements OnInit {
  days?: number = undefined;
  isDescending: boolean = true;
  searchString: string = "";
  take = 4;

  transactions$?: Observable<PaginatedList<Transaction> | null>;
  transactionsLoading$?: Observable<boolean>;

  items: ({ isDescending: boolean; days?: number; title: string })[] = [
    {title: "From recent to latest", days: undefined, isDescending: true},
    {title: "From latest to recent", days: undefined, isDescending: false},
    {title: "1 Day", days: 1, isDescending: true},
    {title: "2 Days", days: 2, isDescending: true},
    {title: "Week", days: 7, isDescending: true},
    {title: "Month", days: 30, isDescending: true},
  ];

  constructor(private store: Store<DashboardReducer.State>) {}

  ngOnInit(): void {
    this.transactions$ = this.store.pipe(
      select(DashboardSelector.selectFoundTransactions),
    );

    this.transactionsLoading$ = this.store.pipe(
      select(DashboardSelector.selectFoundTransactionsLoading),
    );

    this.newSearch("");
  }

  newSearch(input: string): void {
    this.searchString = input;

    this.store.dispatch(fromDashboardActions.findTransactions({searchString: input, page: 1,
      take: this.take, days: this.days, isDescending: this.isDescending}));
  }

  toPage(page: number): void {
    this.store.dispatch(fromDashboardActions.findTransactions({searchString: this.searchString, page: page,
      take: this.take, days: this.days, isDescending: this.isDescending}));
  }

  applySort($event: { isDescending: boolean; days?: number; title: string }) {
    this.days = $event.days;
    this.isDescending = $event.isDescending;

    this.newSearch(this.searchString);
  }
}
