import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ofType, Actions, createEffect } from '@ngrx/effects';
import { map, catchError, of, mergeMap, switchMap, withLatestFrom, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { AddTransactionModalComponent } from '../../add-transaction-modal/add-transaction-modal.component';
import * as fromTransactionsActions from './transactions.actions';
import { EditTransactionModalComponent } from '../../edit-transaction-modal/edit-transaction-modal.component';
import { Category, CustomCategory } from '../models/category';
import { Account, AccountModel } from '../models/account-model';
import { CalculatedAmount, CurrencyResult } from '../models/currency';
import { selectParams, uploadedTransactionSelector } from './transactions.selector';
import { TransactionsService } from '../services/transactions.service';
import { CountModel } from '../models/count-model';
import { HttpParams } from '@angular/common/http';
import { AppState } from '../../../../store';
import { addCategorySuccess, deleteCategorySuccess, editCategorySuccess } from '../../../general/resources/state/general.actions';
import { SuccessModalRedirectData, SuccessModalRedirectComponent } from '../../../../shared/modal/success-modal-redirect/success-modal-redirect.component';
import { openAddTransactonModal, openEditTransactionModal, openUploadTransactonModal } from '../../../../store/actions/modal.actions';
import { UploadTransactionModalComponent } from '../../upload-transaction-modal/upload-transaction-modal.component';
import { UploadTransaction } from '../models/upload-transaction';
import { FailedModalRedirectComponent, FailedModalRedirectData } from '../../../../shared/modal/failed-modal-redirect/failed-modal-redirect.component';
import { Router } from '@angular/router';
import { ButtonConfig } from '../../../../shared/button/button.component';
import { AddTransactions, RequestConfirmData, UploadTransactionsConfirmModalComponent } from '../../upload-transactions-confirm-modal/upload-transactions-confirm-modal.component';

@Injectable()
export class TransactionsEffects {
  openAddTransactionDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(openAddTransactonModal),
        mergeMap((action) => {
          const dialogRef = this.dialog.open(AddTransactionModalComponent, {
            disableClose: true
          });
          return dialogRef.afterClosed();
        })
      ),
    { dispatch: false }
  );

  addTransaction$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromTransactionsActions.addTransaction),
      mergeMap((action) =>
        this.service.post<any>("/api/transaction", action.transaction).pipe(
          map(() => fromTransactionsActions.addTransactionSuccess()),
          catchError((error) =>
            of(
              fromTransactionsActions.addTransactionFailure({
                error: error.status,
              })
            )
          )
        )
      )
    )
  });

  openAddTransactionSuccessDialog = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromTransactionsActions.addTransactionSuccess),
        map(() => {
          this.dialog.closeAll();
          const data: SuccessModalRedirectData = {
            title: 'Success',
            text: 'A transaction was added.',
            primaryButton: {
              label: 'Go to all transactions',
              route: 'transactions/all',
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

  deleteTransaction$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(fromTransactionsActions.deleteTransaction),
        switchMap((action) => {
            return this.service.delete<number>(`/api/transaction/${action.transactionId}`).pipe(
                map(_ => fromTransactionsActions.deleteTransactionSuccess({ transactionId: action.transactionId })),
                catchError(error => of(fromTransactionsActions.deleteTransactionFailure({error:error.status})))
            )
        })
    )
  });

  openUpdateTransactionModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(openEditTransactionModal),
        map((action) => {
          this.dialog.open(EditTransactionModalComponent, {
            data: action.transaction
          });
        })
      ),
    { dispatch: false }
  );

  getCategories$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(fromTransactionsActions.getCategories),
        switchMap(() => {
            return this.service.get<Category[]>('/api/category/').pipe(
                map(categories => {
                    return fromTransactionsActions.getCategoriesSuccess({ categories: categories })
                }),
                catchError(error => of(fromTransactionsActions.getCategoriesFailure({error:error.status}))),
            )
        }
      )
    )
  });

  getAccounts$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(fromTransactionsActions.getAccounts),
        switchMap(() => {
            return this.service.get<Account[]>("/api/account").pipe(
                map(accounts => {
                    return fromTransactionsActions.getAccountsSuccess({ accounts: accounts })
                }),
                catchError(error => of(fromTransactionsActions.getAccountsFailure({error:error.status}))),
            )
        }
      )
    )
  });

  calculateAmount$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(fromTransactionsActions.calculateAmount),
        switchMap((action) => {
            return this.service.post<CalculatedAmount>("/api/currency", action.request).pipe(
                map(amount => {
                    return fromTransactionsActions.calculateAmountSuccess({ amount: amount })
                }),
                catchError(error => of(fromTransactionsActions.calculateAmountFailure({error:error.status}))),
            )
        }
      )
    )
  });

  editTransaction$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromTransactionsActions.editTransaction),
      mergeMap((action) =>
        this.service.put<any>("/api/transaction", action.transaction).pipe(
          map(() => fromTransactionsActions.editTransactionSuccess()),
          catchError((error) =>
            of(
              fromTransactionsActions.editransactionFailure({
                error: error.status,
              })
            )
          )
        )
      )
    )
  });

  openEditTransactionSuccessDialog = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromTransactionsActions.editTransactionSuccess),
        map(() => {
          this.dialog.closeAll();
          const data: SuccessModalRedirectData = {
            title: 'Success',
            text: 'A transaction was edited.',
            primaryButton: {
              label: 'Go to all transactions',
              route: 'transactions/all',
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

  getCurrencies$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(fromTransactionsActions.getCurrencies),
        switchMap(() => {
            return this.service.get<CurrencyResult>('/api/currency').pipe(
                map(currencies => {
                    return fromTransactionsActions.getCurrenciesSuccess({ currencies: currencies })
                }),
                catchError(error => of(fromTransactionsActions.getCurrenciesFailure({error:error.status}))),
            )
        }
      )
    )
  });

  getAccountCurrency$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(fromTransactionsActions.getAccountCurrency),
        switchMap((action) => {
            return this.service.get<string>(`/api/account/${action.id}/currency`).pipe(
                map(currency => {
                    return fromTransactionsActions.getAccountCurrencySuccess({ currency: currency })
                }),
                catchError(error => of(fromTransactionsActions.getAccountCurrencyFailure({error:error.status}))),
            )
        }
      )
    )
  });

  getCustomCategories$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(fromTransactionsActions.getCustomCategories,
          addCategorySuccess, editCategorySuccess,
          deleteCategorySuccess
        ),
        switchMap(() => {
            return this.service.get<CustomCategory[]>('/api/customCategory/').pipe(
                map(categories => {
                    return fromTransactionsActions.getCustomCategoriesSuccess({ categories: categories })
                }),
                catchError(error => of(fromTransactionsActions.getCustomCategoriesFailure({error:error.status}))),
            )
        }
      )
    )
  });

  loadTransactions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromTransactionsActions.loadPaginatedTransactions,
      fromTransactionsActions.addTransactionSuccess,
      fromTransactionsActions.deleteTransactionSuccess,
      fromTransactionsActions.editTransactionSuccess,
      fromTransactionsActions.addTransactionsSuccess,
      fromTransactionsActions.addTransactionsSuccess),
      withLatestFrom(this.store.select(selectParams)),
      switchMap(([action, params]) =>
        this.service.getPaginatedTransactions(params).pipe(
          map((data) => fromTransactionsActions.loadPaginatedTransactionsSuccess({ transactions: data })),
          catchError((error) => of(fromTransactionsActions.loadPaginatedTransactionsFailure({ error: error.status })))
        )
      )
    )
  });

  loadTransactionsCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromTransactionsActions.loadPaginatedTransactionsCount,
        fromTransactionsActions.addTransactionSuccess,
        fromTransactionsActions.deleteTransactionSuccess,
        fromTransactionsActions.addTransactionsSuccess),
      withLatestFrom(this.store.select(selectParams)),
      switchMap(([action, params]) =>
        {
          let url = '/api/transaction/count';
          let accountFilter = params.filter.find(x => x.key === 'account');

          var queryParams = new HttpParams();
          if (accountFilter){
            queryParams = queryParams
            .append('accountId', accountFilter.value)
          };
          if (params.search){
            queryParams = queryParams
            .append('search', params.search)
          };

          return this.service.get<CountModel>(url, queryParams).pipe(
            map(count => {
                return fromTransactionsActions.loadPaginatedTransactionsCountSuccess({ count: count })
            }),
            catchError(error => of(fromTransactionsActions.loadPaginatedTransactionsCountFailure({error:error.status}))),
          )
        }
      )
    )
  });

  loadAccountsInfo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromTransactionsActions.loadAccountsInfo,
        fromTransactionsActions.addTransactionSuccess,
        fromTransactionsActions.deleteTransactionSuccess,
        fromTransactionsActions.addTransactionsSuccess),
      withLatestFrom(this.store.select(selectParams)),
      switchMap(([action, params]) =>
        {
          var queryParams = new HttpParams();
          if (params.search){
            queryParams = queryParams
            .append('search', params.search)
          };
          return this.service.post<AccountModel[]>('/api/account/info', params.filter, queryParams).pipe(
            map(info => {
                return fromTransactionsActions.loadAccountsInfoSuccess({ info: info })
            }),
            catchError(error => of(fromTransactionsActions.loadPaginatedTransactionsCountFailure({error:error.status}))),
          )
        }
      )
    )
  });

  openUploadTransactionDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(openUploadTransactonModal),
        mergeMap((action) => {
          const dialogRef = this.dialog.open(UploadTransactionModalComponent, {
            disableClose: true
          });
          return dialogRef.afterClosed();
        })
      ),
    { dispatch: false }
  );

  uploadTransaction$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromTransactionsActions.uploadTransactions),
      mergeMap((action) => {
        return this.service.upload("/api/transaction/upload", action.file).pipe(
          map((result) => {
            this.dialog.closeAll();
            return fromTransactionsActions.uploadTransactionsSuccess({ transactions: result });
          }),
          catchError((error) =>
            of(
              fromTransactionsActions.uploadTransactionsFailure({
                error: error.status,
              })
            )
          )
        )
      })
    )
  });

  openUploadTransactionsFailedModal = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromTransactionsActions.uploadTransactionsFailure),
        tap(() => {
          this.dialog.closeAll();
          const data: FailedModalRedirectData = {
            primaryButton: {
              label: 'Go to transactions',
              route: '/transactions'
            }
          }
          this.dialog.open(FailedModalRedirectComponent, { data })
        })
      );
    },
    { dispatch: false }
  );

  uploadTransactionConfirmModalOpen$ = createEffect(() =>
    () => {
      return this.actions$.pipe(
      ofType(fromTransactionsActions.uploadTransactionsSuccess),
      map((action) => {
        const see = () => {
          this.dialog.closeAll();
        };
        const cancelButtonConfig: ButtonConfig = { text: 'Cancel', onClick: () => see(), disabled: false }
        const data: RequestConfirmData = {
          outlinedButton: cancelButtonConfig,
          count: action.transactions.length
        }
        const dialogRef = this.dialog.open(UploadTransactionsConfirmModalComponent, {
          data
        });
      })
    )},
    { dispatch: false })

  addTransactions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromTransactionsActions.addTransactions),
      withLatestFrom(this.store.select(uploadedTransactionSelector)),
      switchMap(([action, uploadedTransactions]) =>
        {
          let request: AddTransactions = {
            accountId: action.accountId,
            transactions: uploadedTransactions!.map(source => {
              return {
                note: source.note,
                type: source.type,
                amount: source.amount,
                currency: source.currency,
                accountId: action.accountId,
                exchangeRate: 1,
                date: source.date
              };
          })}
          this.dialog.closeAll();

          return this.service.post<any>("/api/transaction/bulk", request).pipe(
                map(() => {
                  return fromTransactionsActions.addTransactionSuccess()
                }),
                catchError((error) =>
                  of(
                    fromTransactionsActions.addTransactionFailure({
                      error: error.status,
                    })
                  )
                )
              )
        }
      )
    )
  });

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private service: TransactionsService,
    private dialog: MatDialog,
    private router: Router
  ) {}
}
