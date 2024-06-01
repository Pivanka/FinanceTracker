import { createReducer, on } from '@ngrx/store';
import { Member } from '../models/member';
import * as GeneralActions from './general.actions';
import { AccountModel } from '../models/account-model';
import { ValidationErrors } from '@angular/forms';
import { closeModals } from '../../../../store/actions/modal.actions';

export const generalFeatureKey = 'general';

export interface State {
  members: Member[] | null;
  accounts: AccountModel[] | null;
  errors: ValidationErrors | null;
}

export const initialState: State = {
  members: null,
  accounts: null,
  errors: null,
};

export const reducer = createReducer(
  initialState,
  on(GeneralActions.loadMembersSuccess, (state, action) => ({
    ...state,
    members: action.members,
    errors: null
  })),
  on(GeneralActions.loadMembersFailure, (state, action) => ({
    ...state,
    members: [],
    errors: action.error
  })),

  on(GeneralActions.addMemberFailure, (state, action) => {
    return {
      ...state,
      errors: action.error
    };
  }),
  on(GeneralActions.addMemberSuccess, (state, action) => {
    return {
      ...state,
      errors: null
    };
  }),

  on(GeneralActions.loadAccountsSuccess, (state, action) => ({
    ...state,
    accounts: action.accounts,
    errors: null
  })),
  on(GeneralActions.loadAccountsFailure, (state, action) => ({
    ...state,
    accounts: [],
    errors: action.error
  })),

  on(GeneralActions.addAccountFailure, (state, action) => {
    return {
      ...state,
      errors: action.error
    };
  }),
  on(GeneralActions.addAccountSuccess, (state, action) => {
    return {
      ...state,
      errors: null
    };
  }),

  on(GeneralActions.editAccountFailure, (state, action) => {
    return {
      ...state,
      errors: action.error
    };
  }),
  on(GeneralActions.editAccountSuccess, (state, action) => {
    return {
      ...state,
      errors: null
    };
  }),
  on(GeneralActions.deleteAccountFailure, (state, action) => {
    return {
      ...state,
      errors: action.error
    };
  }),
  on(GeneralActions.deleteAccountSuccess, (state, action) => {
    return {
      ...state,
      errors: null
    };
  }),
  on(GeneralActions.deleteCategoryFailure, (state, action) => {
    return {
      ...state,
      errors: action.error
    };
  }),
  on(GeneralActions.deleteCategorySuccess, (state, action) => {
    return {
      ...state,
      errors: null
    };
  }),
  on(GeneralActions.resendMemberEmailFailure, (state, action) => {
    return {
      ...state,
      errors: action.error
    };
  }),
  on(GeneralActions.resendMemberEmailSuccess, (state, action) => {
    return {
      ...state,
      errors: null
    };
  }),
  on(GeneralActions.addCategoryFailure, (state, action) => {
    return {
      ...state,
      errors: action.error
    };
  }),
  on(GeneralActions.addCategorySuccess, (state, action) => {
    return {
      ...state,
      errors: null
    };
  }),
  on(closeModals, (state, action) => {
    return {
      ...state,
      errors: null
    };
  }),
);
