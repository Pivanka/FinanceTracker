import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoginRequest } from '../resources/models/login-request';
import { Store, select } from '@ngrx/store';
import { isSpinnerShowing } from "../../../store/selectors/spinner.selectors";
import { ButtonConfig } from '../../../shared/button/button.component';
import { AppState } from '../../../store';
import { loginPage } from '../../../store/actions/auth.actions';
import { selectErrors } from '../../../store/selectors/auth.selectors';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  submitCfg: ButtonConfig = { onClick: () => this.submit(), text: "Login" , disabled: false }

  email:FormControl = new FormControl('', [Validators.required]);
  password:FormControl = new FormControl('', [Validators.required]);

  loading$?: Observable<boolean>;
  errors$?: Observable<any>;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
    });

    this.loading$ = this.store.pipe(select(isSpinnerShowing));
    this.errors$ = this.store.pipe(select(selectErrors));
  }

  submit(){
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    var request: LoginRequest = {
      email: this.email.value,
      password: this.password.value
    }

    this.store.dispatch(loginPage({loginRequest: request}));
  }
}
