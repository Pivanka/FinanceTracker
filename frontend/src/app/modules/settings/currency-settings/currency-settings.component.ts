import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { openChangeCurrencyModal } from '../../../store/actions/modal.actions';
import { selectCurrency } from '../resources/state/settings.selector';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-currency-settings',
  templateUrl: './currency-settings.component.html',
  styleUrls: ['./currency-settings.component.scss']
})
export class CurrencySettingsComponent implements OnInit {

  currency$!: Observable<string | null>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.currency$ = this.store.select(selectCurrency);
  }

  onCurrencyChange(currency: string) {
    this.store.dispatch(openChangeCurrencyModal({currency: currency}));
  }

}
