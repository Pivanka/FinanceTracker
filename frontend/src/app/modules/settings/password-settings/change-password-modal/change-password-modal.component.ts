import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { isModalLoading, selectPasswordErrors } from '../../resources/state/settings.selector';
import { changePassword } from '../../resources/state/settings.actions';
import { ButtonConfig } from '../../../../shared/button/button.component';
import { AppState } from '../../../../store';
import { closePasswordSettingsModal } from '../../../../store/actions/modal.actions';

export interface PasswordSettingsModel{
  oldPassword: string,
  newPassword: string,
}

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss']
})
export class ChangePasswordModalComponent implements OnInit {

  cancelButtonConfig: ButtonConfig = {
    text: "Cancel",
    onClick: undefined,
  };

  saveButtonConfig: ButtonConfig = {
    text: "Save",
    onClick: undefined,
  }

  form = new FormGroup({
    "oldPassword": new FormControl<string>("", [Validators.required]),
    "newPassword": new FormControl<string>("", [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)]),
  });

  errors$?: Observable<ValidationErrors | null>
  isLoading$?:Observable<boolean>

  constructor(private store: Store<AppState>,
    private ref: MatDialogRef<ChangePasswordModalComponent>) { }

  ngOnInit(): void {
    this.errors$ = this.store.select(selectPasswordErrors);
    this.isLoading$ = this.store.select(isModalLoading);
  }

  close() {
    this.store.dispatch(closePasswordSettingsModal());
  }

  onSubmit() {
    if (!this.form.valid){
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.value;
    const model:PasswordSettingsModel = {
      oldPassword: values.oldPassword!,
      newPassword: values.newPassword!,
    }

    this.store.dispatch(changePassword({settings: model}))
  }
}
