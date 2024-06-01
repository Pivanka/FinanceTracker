import { createAction, props } from "@ngrx/store";
import { Member } from "../models/member";
import { InvitationForm } from "../models/invitationForm";
import { AccountModel } from "../models/account-model";
import { AccountForm } from "../../accounts/add-account-modal/add-account-modal.component";
import { AddCategory } from "../../categories/add-category-modal/add-category-modal.component";
import { EditCategory } from "../../categories/edit-category-modal/edit-category-modal.component";

//load member
export const loadMembers = createAction(
  '[General Component] Load Members',
);

export const loadMembersSuccess = createAction(
  '[General Effects] Load Members Success',
  props<{ members: Member[] }>()
);

export const loadMembersFailure = createAction(
  '[General Effects] Load Members Failure',
  props<{ error: any }>()
);

//resend invitation
export const resendMemberEmail = createAction(
  '[General Component] Resend Member Email',
  props<{id: number}>()
);

export const resendMemberEmailSuccess = createAction(
  '[General Effects] Resend Employee Email Success'
);

export const resendMemberEmailFailure = createAction(
  '[General Effects] Resend Employee Email Failure',
  props<{ error: any }>()
);

//add member
export const addMember = createAction(
  '[General Component] Add Member',
  props<{ member: InvitationForm }>()
);

export const addMemberSuccess = createAction(
  '[General Effects] Add Member Success'
);

export const addMemberFailure = createAction(
  '[General Effects] Add Member Failure',
  props<{ error: any }>()
);


//load accounts
export const loadAccounts = createAction(
  '[General Component] Load Accounts',
);

export const loadAccountsSuccess = createAction(
  '[General Effects] Load Accounts Success',
  props<{ accounts: AccountModel[] }>()
);

export const loadAccountsFailure = createAction(
  '[General Effects] Load Accounts Failure',
  props<{ error: any }>()
);

//add account
export const addAccount = createAction(
  '[General Component] Add Account',
  props<{ account: AccountForm }>()
);

export const addAccountSuccess = createAction(
  '[General Effects] Add Account Success'
);

export const addAccountFailure = createAction(
  '[General Effects] Add Account Failure',
  props<{ error: any }>()
);

//edit account
export const editAccount = createAction(
  '[General Component] Edit Account',
  props<{ account: AccountModel }>()
);

export const editAccountSuccess = createAction(
  '[General Effects] Edit Account Success'
);

export const editAccountFailure = createAction(
  '[General Effects] Edit Account Failure',
  props<{ error: any }>()
);

//add category
export const addCategory = createAction(
  '[General Component] Add Category',
  props<{ category: AddCategory }>()
);

export const addCategorySuccess = createAction(
  '[General Effects] Add Category Success'
);

export const addCategoryFailure = createAction(
  '[General Effects] Add Category Failure',
  props<{ error: any }>()
);

//edit category
export const editCategory = createAction(
  '[General Component] Edit Category',
  props<{ category: EditCategory }>()
);

export const editCategorySuccess = createAction(
  '[General Effects] Edit Category Success'
);

export const editCategoryFailure = createAction(
  '[General Effects] Edit Category Failure',
  props<{ error: any }>()
);

//delete account
export const deleteAccount = createAction(
  '[General Component] Delete Account',
  props<{ account: AccountModel }>()
);

export const deleteAccountSuccess = createAction(
  '[General Effects] Delete Account Success'
);

export const deleteAccountFailure = createAction(
  '[General Effects] Delete Account Failure',
  props<{ error: any }>()
);

//delete category
export const deleteCategory = createAction(
  '[General Component] Delete Category',
  props<{ id: number }>()
);

export const deleteCategorySuccess = createAction(
  '[General Effects] Delete Category Success'
);

export const deleteCategoryFailure = createAction(
  '[General Effects] Delete Category Failure',
  props<{ error: any }>()
);

export const updateMemberRole = createAction(
  '[General Component] Update Member Role',
  props<{id: number, role: number}>()
);