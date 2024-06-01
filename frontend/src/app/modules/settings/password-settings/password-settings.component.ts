import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { openChangePasswordModal } from '../../../store/actions/modal.actions';

@Component({
  selector: 'app-password-settings',
  templateUrl: './password-settings.component.html',
  styleUrls: ['./password-settings.component.scss']
})
export class PasswordSettingsComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
  }

  onPasswordChange() {
    this.store.dispatch(openChangePasswordModal());
  }
}
