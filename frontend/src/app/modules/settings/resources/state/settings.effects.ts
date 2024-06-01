import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { tap, map, catchError, of, mergeMap } from 'rxjs';
import * as fromSettingsActions from './settings.actions';
import { ChangePasswordModalComponent } from '../../password-settings/change-password-modal/change-password-modal.component';
import { ProfileSettingsModel } from '../models/profile-settings';
import { EditProfileModalComponent } from '../../profile-settings/edit-profile-modal/edit-profile-modal.component';
import { ApiService } from '../../../../core/resources/services/api.service';
import { SuccessModalRedirectData, SuccessModalRedirectComponent } from '../../../../shared/modal/success-modal-redirect/success-modal-redirect.component';
import { openChangePasswordModal, closePasswordSettingsModal, openEditProfileModal, openChangeCurrencyModal, closeCurrencySettingsModal } from '../../../../store/actions/modal.actions';
import { ChangeCurrencyModalComponent } from '../../currency-settings/change-currency-modal/change-currency-modal.component';

@Injectable()
export class SettingsEffects {

  openChangePasswordModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(openChangePasswordModal),
        mergeMap(() => {
          const dialogRef = this.dialog.open(ChangePasswordModalComponent, {
            disableClose: true
          });
          return dialogRef.afterClosed();
        })
      ),
    { dispatch: false }
  );

  closeModals$ = createEffect(() =>
      this.actions$.pipe(
        ofType(closePasswordSettingsModal, closeCurrencySettingsModal),
        tap(_ => this.dialog.closeAll()),
      ),
    { dispatch: false }
  );

  updatePassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromSettingsActions.changePassword),
      mergeMap((action) =>
        this.service.put<any>('/api/user/change-password', action.settings).pipe(
          map(() => {
            return fromSettingsActions.changePasswordSuccess()
          }),
          catchError((error) =>
            of(
              fromSettingsActions.changePasswordFailure({
                error: error?.error?.errors ?? {},
              })
            )
          )
        )
      )
    )
  });

  openChangePasswordSuccessDialog = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromSettingsActions.changePasswordSuccess),
        map(() => {
          this.dialog.closeAll();
          const data: SuccessModalRedirectData = {
            title: 'Success',
            text: 'Changing password was success',
            primaryButton: {
              label: 'Go to settings',
              route: 'settings',
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

  loadSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromSettingsActions.loadUserSettings,
        fromSettingsActions.updateProfileSettingsSuccess),
      mergeMap((action) => {
          return this.service.get<ProfileSettingsModel>('/api/user/profile').pipe(
            map((data) =>
              fromSettingsActions.loadUserSettingsSuccess({settings: data})
            ),
            catchError((error) =>
              of(fromSettingsActions.loadUserSettingsFailed({error:error.status}))
            )
          )
        }
      )
    );
  });

  openUpdateProfileModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(openEditProfileModal),
        map((action) => {
          this.dialog.open(EditProfileModalComponent, {
            data: action.profile
          });
        })
      ),
    { dispatch: false }
  );

  updateProfile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromSettingsActions.updateProfileSettings),
      mergeMap((action) =>
        this.service.put<any>('/api/user/profile', action.settings).pipe(
          map((result) => {
            return fromSettingsActions.updateProfileSettingsSuccess()
          }),
          catchError((error) =>
            of(
              fromSettingsActions.updateProfileSettingsFailed({
                error: error.status,
              })
            )
          )
        )
      )
    )
  });

  openUpdateProfileSuccessDialog = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromSettingsActions.updateProfileSettingsSuccess),
        map(() => {
          this.dialog.closeAll();
          const data: SuccessModalRedirectData = {
            title: 'Success',
            text: 'Changing profile was success',
            primaryButton: {
              label: 'Go to settings',
              route: 'settings',
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

  getCurrency$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromSettingsActions.getCurrency, fromSettingsActions.changeCurrencySuccess),
      mergeMap((action) =>
        this.service.get<result>('/api/user/currency').pipe(
          map((result) => {
            return fromSettingsActions.getCurrencySuccess({currency: result.currency})
          }),
          catchError((error) =>
            of(
              fromSettingsActions.getCurrencyFailed({
                error: error.status,
              })
            )
          )
        )
      )
    )
  });

  openChangeCurrencyModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(openChangeCurrencyModal),
        map((action) => {
          this.dialog.open(ChangeCurrencyModalComponent, {
            data: { currency: action.currency }
          });
        })
      ),
    { dispatch: false }
  );

  updateCurrency$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromSettingsActions.changeCurrency),
      mergeMap((action) =>
        this.service.put<any>('/api/user/change-currency/' + action.currency).pipe(
          map(() => {
            return fromSettingsActions.changeCurrencySuccess()
          }),
          catchError((error) =>
            of(
              fromSettingsActions.changeCurrencyFailure({
                error: error?.error?.errors ?? {},
              })
            )
          )
        )
      )
    )
  });

  openCurrencySuccessDialog = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromSettingsActions.changeCurrencySuccess),
        map(() => {
          this.dialog.closeAll();
          const data: SuccessModalRedirectData = {
            title: 'Success',
            text: 'Changing currency was success',
            primaryButton: {
              label: 'Go to settings',
              route: 'settings',
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

  constructor(
    private actions$: Actions,
    private service: ApiService,
    private dialog: MatDialog
  ) {}
}

export interface result {
  currency: string
}
