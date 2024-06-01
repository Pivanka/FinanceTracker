import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { getCurrency } from './resources/state/settings.actions';
import { getCurrencies } from '../transactions/resources/state/transactions.actions';
import { Observable, map } from 'rxjs';
import { selectRole } from './resources/state/settings.selector';
import { Role } from '../auth/resources/models/role';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {

  hasAccess$!: Observable<boolean | null>;
  constructor(private store: Store<AppState>) {
    this.hasAccess$ = this.store.select(selectRole).pipe(
      map(role => role == Role.Admin)
    );
   }

  ngOnInit() {
    this.store.dispatch(getCurrency());
    this.store.dispatch(getCurrencies());
  }

}
