import { Component, OnInit } from '@angular/core';
import { FormGroup, ValidationErrors, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { InvitationForm } from '../../resources/models/invitationForm';
import { Store, select } from '@ngrx/store';
import { selectErrors } from '../../resources/state/general.selector';
import { addMember } from '../../resources/state/general.actions';
import { AppState } from '../../../../store';
import { Role } from '../../../auth/resources/models/role';

interface CustomValidatorConfig {
  pattern: RegExp;
  msg: string;
}

@Component({
  selector: 'app-add-member-modal',
  templateUrl: './add-member-modal.component.html',
  styleUrls: ['./add-member-modal.component.scss']
})
export class AddMemberModalComponent implements OnInit {
  roles: string[] = Object.keys(Role).filter(x => isNaN(Number(x)) && x !== 'Empty');
  memberForm!: FormGroup;
  serverErrors$: Observable<ValidationErrors | null>;

  constructor(
    public dialogRef: MatDialogRef<AddMemberModalComponent>,
    private store: Store<AppState>) {
    this.serverErrors$ = this.store.pipe(select(selectErrors));
  }

  ngOnInit(): void {
    this.memberForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(75)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(75)]),
      role: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    this.memberForm!.markAllAsTouched();
    if (!this.memberForm.valid) return;

    const result: InvitationForm = {
      firstName: this.memberForm.controls['firstName'].value,
      email: this.memberForm.controls['email'].value,
      lastName: this.memberForm.controls['lastName'].value,
      role: +Role[this.getFormControl('role').value]
    };

    this.store.dispatch(addMember({ member: result }));
  }

  getFormControl(controlName: string) {
    return this.memberForm?.get(controlName) as FormControl;
  }
}
