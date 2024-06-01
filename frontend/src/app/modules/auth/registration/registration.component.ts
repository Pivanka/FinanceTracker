import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { RegistrationValidationForm } from '../resources/models/registrationValidationForm';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { ButtonConfig } from '../../../shared/button/button.component';
import { register } from '../../../store/actions/auth.actions';
import { Observable } from 'rxjs';
import { selectErrors } from '../../../store/selectors/auth.selectors';

interface CustomValidatorConfig {
  pattern: RegExp,
  msg: string;
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  form: FormGroup = new FormGroup({
    'firstName': new FormControl('', [Validators.minLength(2), Validators.maxLength(75)]),
    'email': new FormControl('', [Validators.required, Validators.email]),
    'lastName': new FormControl('', [Validators.minLength(2), Validators.maxLength(75)]),
    'password': new FormControl('', [Validators.required,
    this.customPatternValidator({ pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, msg: "Weak password" })]),
  });

  submitCfg: ButtonConfig = { onClick:() => this.onSubmit() ,text: "Register", disabled: false };

  errors$?: Observable<any>;

  constructor(private store: Store<AppState>) { }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    const result: RegistrationValidationForm = {
      firstName: this.form.controls['firstName'].value,
      email: this.form.controls['email'].value,
      lastName: this.form.controls['lastName'].value,
      password: this.form.controls['password'].value,
    };

    this.store.dispatch(register({ request: result }));
    this.errors$ = this.store.pipe(select(selectErrors));
  }

  ngOnInit(): void {
  }

  public customPatternValidator(config: CustomValidatorConfig): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let urlRegEx: RegExp = config.pattern;
      if (control.value && !control.value.match(urlRegEx)) {
        return {
          invalidMsg: config.msg
        };
      } else {
        return null;
      }
    };
  }

  public getFormControl(controlName: string) {
    return this.form.get(controlName) as FormControl;
  }

}
