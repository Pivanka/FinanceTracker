import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectTransactionsCount } from './resources/state/transactions.selector';
import * as fromTransactionsActions from './resources/state/transactions.actions';
import { CountModel } from './resources/models/count-model';
import { Observable } from 'rxjs';
import { ButtonConfig } from '../../shared/button/button.component';
import { AppState } from '../../store';
import { openAddTransactonModal, openUploadTransactonModal } from '../../store/actions/modal.actions';
import { showSpinner } from '../../store/actions/spinner.actions';
import { SignalRType } from '../../shared/models/signalR-type';
import { SignalRService } from '../../core/resources/services/signalR.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  primaryButton: ButtonConfig = { text: 'Create a transaction', onClick: () => this.createTransaction(), disabled: false };
  secondaryButton: ButtonConfig = { text: 'Upload transactions', onClick: () => this.uploadTransaction(), disabled: false };

  counters$:Observable<CountModel | null>;

  constructor(private store: Store<AppState>, private signalRService: SignalRService) {
    this.counters$ = this.store.select(selectTransactionsCount);
  }

  ngOnInit(): void {
    this.store.dispatch(showSpinner());
    this.store.dispatch(fromTransactionsActions.getCategories());
    this.store.dispatch(fromTransactionsActions.getCustomCategories());
    this.store.dispatch(fromTransactionsActions.getAccounts());
    this.store.dispatch(fromTransactionsActions.getCurrencies());

    this.signalRService.addChangesListener((type: SignalRType) => {
      if(type === SignalRType.Transaction) {
        this.store.dispatch(fromTransactionsActions.loadPaginatedTransactions());
        this.store.dispatch(fromTransactionsActions.loadPaginatedTransactionsCount());
        this.store.dispatch(fromTransactionsActions.loadAccountsInfo());
      }
    });
  }

  newSearch(input: string) {
    this.store.dispatch(fromTransactionsActions.searchTransactions({ search: input }));
    this.store.dispatch(fromTransactionsActions.loadPaginatedTransactions());
    this.store.dispatch(fromTransactionsActions.loadPaginatedTransactionsCount());
    this.store.dispatch(fromTransactionsActions.loadAccountsInfo());
  }

  createTransaction(){
    this.store.dispatch(openAddTransactonModal());
  }

  uploadTransaction(){
    this.store.dispatch(openUploadTransactonModal());
  }
}

