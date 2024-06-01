import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Balance } from '../resources/models/balance';
import { Store, select } from '@ngrx/store';
import * as DashboardSelector from "../resources/state/dashboard.selectors";
import * as fromDashboardActions from "../resources/state/dashboard.actions";
import { AppState } from '../../../store';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {
  balance$?: Observable<Balance | null>;
  currentMonth = new Date()

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.balance$ = this.store.pipe(select(DashboardSelector.selectBalance));
    this.store.dispatch(fromDashboardActions.loadBalance());
  }

}
