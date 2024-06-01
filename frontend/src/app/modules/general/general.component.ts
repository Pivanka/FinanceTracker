import { Component, OnInit, TemplateRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadAccounts, loadMembers } from './resources/state/general.actions';
import { selectAccountsCount, selectMembersCount } from './resources/state/general.selector';
import { getCategories, getCurrencies, getCustomCategories } from '../transactions/resources/state/transactions.actions';
import { AppState } from '../../store';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  templateRef?: TemplateRef<any> | undefined
  accountsCount$?:Observable<number>;
  membersCount$?:Observable<number>;

  constructor(
    private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.store.dispatch(loadAccounts());
    this.store.dispatch(loadMembers());
    this.accountsCount$ = this.store.pipe(select(selectAccountsCount))
    this.membersCount$ = this.store.pipe(select(selectMembersCount));
    this.store.dispatch(getCategories());
    this.store.dispatch(getCustomCategories());
    this.store.dispatch(getCurrencies());
  }

}
