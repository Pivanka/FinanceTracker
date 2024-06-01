import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { map, catchError, of, mergeMap, concatMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { Member } from '../models/member';
import { AddMemberModalComponent } from '../../members/add-member-modal/add-member-modal.component';
import { AccountModel } from '../models/account-model';
import { AddAccountModalComponent } from '../../accounts/add-account-modal/add-account-modal.component';
import { EditAccountModalComponent } from '../../accounts/edit-account-modal/edit-account-modal.component';
import { AddCategoryModalComponent } from '../../categories/add-category-modal/add-category-modal.component';
import { EditCategoryModalComponent } from '../../categories/edit-category-modal/edit-category-modal.component';
import { ApiService } from '../../../../core/resources/services/api.service';
import { AppState } from '../../../../store';
import { SuccessModalRedirectData, SuccessModalRedirectComponent } from '../../../../shared/modal/success-modal-redirect/success-modal-redirect.component';
import { ButtonConfig } from '../../../../shared/button/button.component';
import { DeleteAccountConfirmModalComponent, RequestConfirmData } from '../../accounts/delete-account-confirm-modal/delete-account-confirm-modal.component';
import { DeleteCategoryConfirmModalComponent } from '../../categories/delete-category-confirm-modal/delete-category-confirm-modal.component';
import * as fromGeneralActions from './general.actions';
import * as ModalActions from '../../../../store/actions/modal.actions';

@Injectable()
export class GeneralEffects {
  loadMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromGeneralActions.loadMembers, fromGeneralActions.addMemberSuccess),
      mergeMap(() =>
        this.service.get<Member[]>('/api/user').pipe(
          map((data) =>
            fromGeneralActions.loadMembersSuccess({ members: data })
          ),
          catchError((error) =>
            of(
              fromGeneralActions.loadMembersFailure({
                error: error.status,
              })
            )
          )
        )
      )
    )
  );

  openAddUserModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ModalActions.openAddMemberModal),
        mergeMap((action) => {
          const dialogRef = this.dialog.open(AddMemberModalComponent, {
            disableClose: true
          });
          return dialogRef.afterClosed();
        })
      ),
    { dispatch: false }
  );

  resendMemberEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromGeneralActions.resendMemberEmail),
      mergeMap((action) =>
        this.service.put<any>(`/api/user/${action.id}/resend-email`).pipe(
          map(() => fromGeneralActions.resendMemberEmailSuccess()),
          catchError((error) =>
            of(
              fromGeneralActions.resendMemberEmailFailure({
                error: error.status,
              })
            )
          )
        ),
      )
    )
  );

  addMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromGeneralActions.addMember),
      mergeMap((action) =>
        this.service.post<any>('/api/user', action.member).pipe(
          map(() => fromGeneralActions.addMemberSuccess()),
          catchError((error) =>
            of(
              fromGeneralActions.addMemberFailure({
                error: error.status,
              })
            )
          )
        )
      )
    )
  });

  openSendInvitationSuccessDialog = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromGeneralActions.addMemberSuccess, fromGeneralActions.resendMemberEmailSuccess),
        map(() => {
          this.dialog.closeAll();
          const data: SuccessModalRedirectData = {
            title: 'Success',
            text: 'An email invitation has been sent to the member.',
            primaryButton: {
              label: 'Go to all members',
              route: 'general/members',
            },
          };
          this.dialog.open(SuccessModalRedirectComponent, {
            disableClose: true,
            data,
          });
        })
      );
    },
    { dispatch: false }
  );

  loadAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromGeneralActions.loadAccounts,
        fromGeneralActions.addAccountSuccess,
        fromGeneralActions.editAccountSuccess,
        fromGeneralActions.deleteAccountSuccess),
      mergeMap(() =>
        this.service.get<AccountModel[]>('/api/account').pipe(
          map((data) =>
            fromGeneralActions.loadAccountsSuccess({ accounts: data })
          ),
          catchError((error) =>
            of(
              fromGeneralActions.loadAccountsFailure({
                error: error.status,
              })
            )
          )
        )
      )
    )
  );

  openAddAccountModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ModalActions.openAddAccountModal),
        mergeMap((action) => {
          const dialogRef = this.dialog.open(AddAccountModalComponent, {
            disableClose: true
          });
          return dialogRef.afterClosed();
        })
      ),
    { dispatch: false }
  );

  addAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromGeneralActions.addAccount),
      mergeMap((action) =>
        this.service.post<any>('/api/account', action.account).pipe(
          map(() => fromGeneralActions.addAccountSuccess()),
          catchError((error) =>
            of(
              fromGeneralActions.addAccountFailure({
                error: error.status,
              })
            )
          )
        )
      )
    )
  });

  openAddAccountSuccessDialog = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromGeneralActions.addAccountSuccess),
        map(() => {
          this.dialog.closeAll();
          const data: SuccessModalRedirectData = {
            title: 'Success',
            text: 'An account was created successfully',
            primaryButton: {
              label: 'Go to all account',
              route: 'general/accounts',
            },
          };
          this.dialog.open(SuccessModalRedirectComponent, {
            disableClose: true,
            data,
          });
        })
      );
    },
    { dispatch: false }
  );

  openEditAccountModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ModalActions.openEditAccountModal),
        map((action) => {
          this.dialog.open(EditAccountModalComponent, {
            data: action.account
          });
        })
      ),
    { dispatch: false }
  );

  editAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromGeneralActions.editAccount),
      mergeMap((action) =>
        this.service.put<any>('/api/account', action.account).pipe(
          map(() => fromGeneralActions.editAccountSuccess()),
          catchError((error) =>
            of(
              fromGeneralActions.editAccountFailure({
                error: error.status,
              })
            )
          )
        )
      )
    )
  });

  openEditAccountSuccessDialog = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromGeneralActions.editAccountSuccess),
        map(() => {
          this.dialog.closeAll();
          const data: SuccessModalRedirectData = {
            title: 'Success',
            text: 'An account was edited successfully',
            primaryButton: {
              label: 'Go to all account',
              route: 'general/accounts',
            },
          };
          this.dialog.open(SuccessModalRedirectComponent, {
            disableClose: true,
            data,
          });
        })
      );
    },
    { dispatch: false }
  );

  openAddCategoryModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ModalActions.openAddCategoryModal),
        mergeMap((action) => {
          const dialogRef = this.dialog.open(AddCategoryModalComponent, {
            disableClose: true
          });
          return dialogRef.afterClosed();
        })
      ),
    { dispatch: false }
  );

  addCategory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromGeneralActions.addCategory),
      mergeMap((action) =>
        this.service.post<any>('/api/customCategory', action.category).pipe(
          map(() => fromGeneralActions.addCategorySuccess()),
          catchError((error) =>
            of(
              fromGeneralActions.addCategoryFailure({
                error: error?.error?.errors ?? {},
              })
            )
          )
        )
      )
    )
  });

  openAddCategorySuccessDialog = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromGeneralActions.addCategorySuccess),
        map(() => {
          this.dialog.closeAll();
          const data: SuccessModalRedirectData = {
            title: 'Success',
            text: 'A category was added successfully',
            primaryButton: {
              label: 'Go to all categories',
              route: 'general/categories',
            },
          };
          this.dialog.open(SuccessModalRedirectComponent, {
            disableClose: true,
            data,
          });
        })
      );
    },
    { dispatch: false }
  );

  openEditCategoryModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ModalActions.openEditCategoryModal),
        map((action) => {
          this.dialog.open(EditCategoryModalComponent, {
            data: action.category
          });
        })
      ),
    { dispatch: false }
  );

  editCategory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromGeneralActions.editCategory),
      mergeMap((action) =>
        this.service.put<any>('/api/customCategory', action.category).pipe(
          map(() => fromGeneralActions.editCategorySuccess()),
          catchError((error) =>
            of(
              fromGeneralActions.editAccountFailure({
                error: error?.error?.errors ?? {},
              })
            )
          )
        )
      )
    )
  });

  openEditCategorySuccessDialog = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromGeneralActions.editCategorySuccess),
        map(() => {
          this.dialog.closeAll();
          const data: SuccessModalRedirectData = {
            title: 'Success',
            text: 'A category was edited successfully',
            primaryButton: {
              label: 'Go to all categories',
              route: 'general/categories',
            },
          };
          this.dialog.open(SuccessModalRedirectComponent, {
            disableClose: true,
            data,
          });
        })
      );
    },
    { dispatch: false }
  );

  deleteAccountConfirmModalOpen$ = createEffect(() =>
    () => {
      return this.actions$.pipe(
      ofType(ModalActions.openDeleteAccountConfirmModal),
      map((action) => {
        const remove = () => {
          this.store.dispatch(fromGeneralActions.deleteAccount({account: action.account}));
        };
        const cancel = () => {
          this.store.dispatch(ModalActions.closeModals());
        };
        const deleteButtonConfig: ButtonConfig = { text: 'Delete', onClick: () => remove(), disabled: false }
        const cancelButtonConfig: ButtonConfig = { text: 'Cancel', onClick: () => cancel(), disabled: false }
        const data: RequestConfirmData = {
          title: `Are you sure you want to delete Account - ${action.account.title}?`,
          primaryButton: deleteButtonConfig,
          declineButton: cancelButtonConfig
        }
        const dialogRef = this.dialog.open(DeleteAccountConfirmModalComponent, {
          data
        });
      })
    )},
    { dispatch: false })

  deleteAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromGeneralActions.deleteAccount),
      mergeMap((action) =>
        this.service.delete<any>(`/api/account/${action.account.id}`).pipe(
          map(() => fromGeneralActions.deleteAccountSuccess()),
          catchError((error) =>
            of(
              fromGeneralActions.deleteAccountFailure({
                error: error.status,
              })
            )
          )
        )
      )
    );
  });

  deleteCategoryConfirmModalOpen$ = createEffect(() =>
    () => {
      return this.actions$.pipe(
      ofType(ModalActions.openDeleteCategoryConfirmModal),
      map((action) => {
        const remove = () => {
          this.store.dispatch(fromGeneralActions.deleteCategory({id: action.category.id}));
        };
        const cancel = () => {
          this.store.dispatch(ModalActions.closeModals());
        };
        const deleteButtonConfig: ButtonConfig = { text: 'Delete', onClick: () => remove(), disabled: false }
        const cancelButtonConfig: ButtonConfig = { text: 'Cancel', onClick: () => cancel(), disabled: false }
        const data: RequestConfirmData = {
          title: `Are you sure you want to delete Category - ${action.category.title}?`,
          primaryButton: deleteButtonConfig,
          declineButton: cancelButtonConfig
        }
        const dialogRef = this.dialog.open(DeleteCategoryConfirmModalComponent, {
          data
        });
      })
    )},
    { dispatch: false })

  deleteCategory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromGeneralActions.deleteCategory),
      mergeMap((action) =>
        this.service.delete<any>(`/api/customCategory/${action.id}`).pipe(
          map(() => fromGeneralActions.deleteCategorySuccess()),
          catchError((error) =>
            of(
              fromGeneralActions.deleteCategoryFailure({
                error: error.status,
              })
            )
          )
        )
      )
    );
  });

  updateMemberRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromGeneralActions.updateMemberRole),
      concatMap((action) =>
        this.service.post<any>(`/api/user/${action.id}/role`, action.role).pipe(
          map(() => fromGeneralActions.loadMembers())
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private service: ApiService,
    private dialog: MatDialog
  ) {}
}
