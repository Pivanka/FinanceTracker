import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { select, Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { ValidateFilesize } from "../../resources/validators/filesize.validator";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ProfileSettingsModel, SettingsModel } from '../../resources/models/profile-settings';
import { isModalLoading } from '../../resources/state/settings.selector';
import { updateProfileSettings } from '../../resources/state/settings.actions';
import { ButtonConfig } from '../../../../shared/button/button.component';
import { AppState } from '../../../../store';
import { closeModals } from '../../../../store/actions/modal.actions';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss']
})
export class EditProfileModalComponent implements OnInit {
  cancelButtonConfig: ButtonConfig = {
    text: 'Cancel',
    onClick: undefined,
  };

  saveButtonConfig: ButtonConfig = {
    text: 'Save',
    disabled: true,
    onClick: undefined,
  };

  form = new FormGroup({
    "firstName": new FormControl<string>(this.data.firstName, [Validators.required]),
    "lastName": new FormControl<string>(this.data.lastName, [Validators.required]),
    "avatar": new FormControl<string | null>(this.data.avatar, [ValidateFilesize]),
    "email": new FormControl<string>(this.data.email, [Validators.required, Validators.email]),
  });

  formChanges$?: Subscription;
  isLoading$?:Observable<boolean>

  constructor(private store$: Store<AppState>,
    private ref: MatDialogRef<EditProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProfileSettingsModel) { }

  ngOnInit(): void {
    this.isLoading$ = this.store$.pipe(select(isModalLoading));
  }

  onSubmit(){
    if (!this.form.valid){
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.value;
    const model:SettingsModel = {
      avatar: values.avatar ?? null,
      firstName: values.firstName!,
      lastName: values.lastName!,
      email: values.email!
    }

    this.store$.dispatch(updateProfileSettings({settings: model}));
  }

  onFileChange($event: Event) {
    const input = $event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const fileUrl = reader.result;
        this.form.patchValue({
          avatar: fileUrl?.toString()
        });

        this.form.controls.avatar.markAsTouched();
      }

    }
  }

  selectImage():string {
    let st = "assets/images/icons/avatar.svg";

    if (this.form.value.avatar)
      st = this.form.value.avatar

    return `url('${st}')`;
  }

  remove() {
    this.form.patchValue({avatar: null});
  }

  close() {
    this.store$.dispatch(closeModals());
  }
}

