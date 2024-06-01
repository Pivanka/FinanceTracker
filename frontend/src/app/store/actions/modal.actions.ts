import { createAction, props } from "@ngrx/store";
import { Transaction } from "../../modules/dashboard/resources/models/transaction";
import { AccountModel } from "../../modules/general/resources/models/account-model";
import { ProfileSettingsModel } from "../../modules/settings/resources/models/profile-settings";
import { CustomCategory } from "../../modules/transactions/resources/models/category";
import { Notification } from "../../modules/dashboard/resources/models/notification";

export const openExampleSuccessModal = createAction('[Modal Component] Opened modal');

export const openExampleConfirmationModal = createAction('[Modal Component] Opened example confirmation modal')

export const closeModals = createAction('[Modal Component] Closed modal');

export const openAddMemberModal = createAction('[Modal Component] Open add member modal');

export const openAddTransactonModal = createAction('[Modal Component] Open add transaction modal');

export const openAddAccountModal = createAction('[Modal Component] Open add account modal');

export const openEditAccountModal = createAction(
  '[Modal Component] Open edit account modal',
  props<{ account: AccountModel }>());

export const openChangePasswordModal = createAction('[Modal Component] Open change password modal');
export const openChangeCurrencyModal = createAction(
  '[Modal Component] Open change currency modal',
  props<{ currency: string }>());

export const closePasswordSettingsModal = createAction(
  '[Modal Component] Close Change Password Settings Modal',
)
export const closeCurrencySettingsModal = createAction(
  '[Modal Component] Close Change Currency Settings Modal',
)

export const openEditProfileModal = createAction(
  '[Modal Component] Open edit profile modal',
  props<{ profile: ProfileSettingsModel }>());

export const openEditTransactionModal = createAction(
  '[Modal Component] Open edit transaction modal',
  props<{ transaction: Transaction }>());

export const openAddCategoryModal = createAction('[Modal Component] Open add category modal');

export const openEditCategoryModal = createAction(
  '[Modal Component] Open edit category modal',
  props<{ category: CustomCategory }>());

export const openDeleteAccountConfirmModal = createAction(
  '[Modal Component] Open delete account confirm modal',
  props<{ account: AccountModel }>());

export const openDeleteCategoryConfirmModal = createAction(
    '[Modal Component] Open delete category confirm modal',
    props<{ category: CustomCategory }>());

export const openUploadTransactonModal = createAction('[Modal Component] Open upload transaction modal');

export const openNotificationModal = createAction(
  '[Modal Component] Open notification modal',
  props<{ notification: Notification }>());
