import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as fromAuthActions from '../actions/auth.actions';
import * as fromModalActions from '../actions/modal.actions';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { deleteAccountFailure, deleteAccountSuccess, deleteCategoryFailure, deleteCategorySuccess } from '../../modules/general/resources/state/general.actions';

@Injectable()
export class ModalEffects {
  hideModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromAuthActions.loginSuccess),
        tap(() => {
          // hide modal
        })
      ),
    { dispatch: false }
  );

  closeModals$ = createEffect(() =>
      this.actions$.pipe(
        ofType(fromModalActions.closeModals,
          deleteAccountFailure, deleteAccountSuccess,
          deleteCategoryFailure, deleteCategorySuccess
        ),
        tap(_ => this.dialog.closeAll()),
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions,
    private dialog: MatDialog,) {}
}
