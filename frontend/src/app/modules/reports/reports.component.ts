import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { getAccounts, loadAccountsInfo } from '../transactions/resources/state/transactions.actions';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(loadAccountsInfo());
    this.store.dispatch(getAccounts());
  }

}
