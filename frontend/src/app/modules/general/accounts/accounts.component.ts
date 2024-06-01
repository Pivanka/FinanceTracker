import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { AccountModel } from '../resources/models/account-model';
import { selectAccounts } from '../resources/state/general.selector';
import { ButtonConfig } from '../../../shared/button/button.component';
import { AppState } from '../../../store';
import { openAddAccountModal } from '../../../store/actions/modal.actions';
import { isSpinnerShowing } from '../../../store/selectors/spinner.selectors';
import { SignalRService } from '../../../core/resources/services/signalR.service';
import { SignalRType } from '../../../shared/models/signalR-type';
import { loadAccounts } from '../resources/state/general.actions';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  selected = -1;
  accounts$?: Observable<AccountModel[] | null>;
  loading!: Observable<boolean>;

  config: ButtonConfig = {
    text: "+ Add an account",
    onClick: undefined,
  }

  constructor(private store: Store<AppState>, private signalRService: SignalRService) {
   }

  ngOnInit(): void {
    this.loading = this.store.pipe(select(isSpinnerShowing));
    this.accounts$ = this.store.select(selectAccounts);

    this.signalRService.addChangesListener((type: SignalRType) => {
      if(type === SignalRType.Account) {
        this.store.dispatch(loadAccounts());
      }
    });
  }

  select(index: number): void{
    this.selected = index;
  }

  addAccount() {
    this.store.dispatch(openAddAccountModal());
  }

}
