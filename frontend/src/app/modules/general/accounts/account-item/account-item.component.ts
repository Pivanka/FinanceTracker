import { Component, Input, OnInit } from '@angular/core';
import { AccountModel } from '../../resources/models/account-model';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../store';
import { openDeleteAccountConfirmModal, openEditAccountModal } from '../../../../store/actions/modal.actions';
import { Observable, map } from 'rxjs';
import { Role } from '../../../auth/resources/models/role';
import { selectRole } from '../../../settings/resources/state/settings.selector';

@Component({
  selector: 'app-account-item',
  templateUrl: './account-item.component.html',
  styleUrls: ['./account-item.component.scss']
})
export class AccountItemComponent implements OnInit {

  @Input() model!: AccountModel;
  hasUpdatingAccess$!: Observable<boolean | null>;
  hasDeletingAccess$!: Observable<boolean | null>;
  hasNoAccess$!: Observable<boolean | null>;

  constructor(private store: Store<AppState>) {
    this.hasUpdatingAccess$ = this.store.pipe(select(selectRole)).pipe(
      map(role => role == Role.Admin || role == Role.Manager)
    );
    this.hasDeletingAccess$ = this.store.pipe(select(selectRole)).pipe(
      map(role => role == Role.Admin)
    );
    this.hasNoAccess$ = this.store.pipe(select(selectRole)).pipe(
      map(role => role == Role.Empty || role == Role.Viewer)
    );
   }

  ngOnInit(): void { }

  getIcon(){
    return 'assets/images/icons/account_bank.svg';
  }

  openEditModal() {
    this.store.dispatch(openEditAccountModal({ account: this.model }));
  }

  onDeleteClick() {
    this.store.dispatch(openDeleteAccountConfirmModal({ account: this.model }))
  }

}
