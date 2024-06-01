import { Injectable } from "@angular/core";
import { Filter, FilterType } from "../../../../shared/models/query-params";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../store";
import * as fromTransactionsActions from '../state/transactions.actions';

@Injectable({
  providedIn: 'root'
})
export class DispatchingTransactionsService {

  constructor(private store: Store<AppState>) { }

  dispatchTransactions(type: string) {
    this.store.dispatch(fromTransactionsActions.clearTransactions());

    let filters: Filter[] = [
      {
        key: "type",
        value: type,
        filterType: FilterType.equals
      }
    ]
    this.store.dispatch(fromTransactionsActions.setFilterTransactions({ filter: filters }));
    this.store.dispatch(fromTransactionsActions.loadPaginatedTransactions());
    this.store.dispatch(fromTransactionsActions.loadPaginatedTransactionsCount());
    this.store.dispatch(fromTransactionsActions.loadAccountsInfo());
  }
}
