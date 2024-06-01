import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ButtonConfig } from '../../../../shared/button/button.component';
import { AppState } from '../../../../store';
import { closeCurrencySettingsModal } from '../../../../store/actions/modal.actions';
import { ChangePasswordModalComponent, PasswordSettingsModel } from '../../password-settings/change-password-modal/change-password-modal.component';
import { changeCurrency, changePassword } from '../../resources/state/settings.actions';
import { isModalLoading } from '../../resources/state/settings.selector';
import { CurrencyModel } from '../../../transactions/resources/models/currency';
import { selectCurrencies } from '../../../transactions/resources/state/transactions.selector';

@Component({
  selector: 'app-change-currency-modal',
  templateUrl: './change-currency-modal.component.html',
  styleUrls: ['./change-currency-modal.component.scss']
})
export class ChangeCurrencyModalComponent implements OnInit {

  cancelButtonConfig: ButtonConfig = {
    text: "Cancel",
    onClick: () => this.close(),
  };

  saveButtonConfig: ButtonConfig = {
    text: "Change",
    onClick: () => this.onSubmit(),
  }

  currencies$!: Observable<CurrencyModel[]>;

  constructor(private store: Store<AppState>,
    public dialogRef: MatDialogRef<ChangeCurrencyModalComponent>,
    @Inject(MAT_DIALOG_DATA) public currency: string) { }

  ngOnInit(): void {
    this.currencies$ = this.store.select(selectCurrencies);
  }

  close() {
    this.store.dispatch(closeCurrencySettingsModal());
  }

  selectedCurrency?: string;
  selectCurrency(currency: any)
  {
    this.selectedCurrency = currency.currency;
  }

  onSubmit() {
    if (!this.selectedCurrency || this.selectedCurrency === this.currency){
      return;
    }

    this.store.dispatch(changeCurrency({currency: this.selectedCurrency}))
  }
}
