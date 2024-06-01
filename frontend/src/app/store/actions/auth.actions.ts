import { createAction, props } from "@ngrx/store";
import { LoginRequest } from "../../modules/auth/resources/models/login-request";
import { LoginResult } from "../../modules/auth/resources/models/login-result";
import { RegistrationValidationForm } from "../../modules/auth/resources/models/registrationValidationForm";

export const loginPage = createAction(
  '[Login Component] Login User',
  props<{loginRequest:LoginRequest}>()
);

export const loginSuccess = createAction(
  '[Auth Effect] Login User Success',
  props<{ loginResult: LoginResult }>()
);

export const loginFailure = createAction(
  '[Auth Effect] Login User Failure',
  props<{ error: any }>()
);

export const logout = createAction('[Menu Component] Logout');

export const backToLoginPage = createAction(
  '[Login Component] Back to Login Page',
)

export const register = createAction(
  '[Register Component] Register User',
  props<{ request: RegistrationValidationForm }>()
);

export const registerSuccess = createAction(
  '[Auth Effect] Register User Success',
  props<{ result: LoginResult }>()
);

export const redgisterFailure = createAction(
  '[Auth Effect] Register User Failure',
  props<{ error: any }>()
);
