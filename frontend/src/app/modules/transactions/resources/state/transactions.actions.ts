import { createAction, props } from "@ngrx/store";
import { AddTransaction } from "../../add-transaction-modal/add-transaction-modal.component";
import { Category, CustomCategory } from "../models/category";
import { Account, AccountModel } from "../models/account-model";
import { EditTransaction } from "../../edit-transaction-modal/edit-transaction-modal.component";
import { CalculateRateRequest, CalculatedAmount, CurrencyResult } from "../models/currency";
import { CountModel } from "../models/count-model";
import { PaginatedList } from "../../../../shared/models/paginated-list";
import { Filter, Sort } from "../../../../shared/models/query-params";
import { Transaction } from "../../../dashboard/resources/models/transaction";
import { UploadTransaction } from "../models/upload-transaction";
import { AddTransactions } from "../../upload-transactions-confirm-modal/upload-transactions-confirm-modal.component";

export const setLoading = createAction(
  '[Transactions Component] Set Loading',
  props<{ loading: boolean }>()
)

export const addTransaction = createAction(
  '[Transactions Component] Add Transaction',
  props<{ transaction: AddTransaction }>()
);

export const addTransactionSuccess = createAction(
  '[Transactions Effects] Add Transaction Success'
);

export const addTransactionFailure = createAction(
  '[Transactions Effects] Add Transaction Failure',
  props<{ error: any }>()
);

export const setSortProp = createAction(
  '[Transactions Component] Set sort prop',
  props<{prop:string}>()
);

export const toggleSortOrder = createAction(
  '[Transactions Component] Toggle sort order');


export const deleteTransaction = createAction(
    '[Transactions Component] Delete Transaction',
    props<{ transactionId: number }>()
)

export const deleteTransactionSuccess = createAction(
    '[Transactions Effects] Delete Transaction Success',
    props<{ transactionId: number }>(),
)

export const deleteTransactionFailure = createAction(
    '[Transactions Effects] Delete Transaction failure',
    props<{ error: any }>(),
)

export const setAccountFilter = createAction(
  '[Transactions Component] set filter by account',
  props<{ filter: number | string | undefined }>()
)

export const getCategories = createAction(
  '[Transactions Component] Get Categories'
);

export const getCategoriesSuccess = createAction(
  '[Transactions Component] Get Categories Success',
  props<{ categories: Category[] }>()
);

export const getCategoriesFailure = createAction(
  '[Transactions Component] Get Categories Failure',
  props<{ error: any }>(),
);

export const getAccounts = createAction(
  '[Transactions Component] Get Accounts'
);

export const getAccountsSuccess = createAction(
  '[Transactions Component] Get Accounts Success',
  props<{ accounts: Account[] }>()
);

export const getAccountsFailure = createAction(
  '[Transactions Component] Get Accounts Failure',
  props<{ error: any }>(),
);

export const editTransaction = createAction(
  '[Transactions Component] edit Transaction',
  props<{ transaction: EditTransaction }>()
);

export const editTransactionSuccess = createAction(
  '[Transactions Effects] edit Transaction Success'
);

export const editransactionFailure = createAction(
  '[Transactions Effects] edit Transaction Failure',
  props<{ error: any }>()
);

export const getCurrencies = createAction(
  '[Transactions Component] Get Currencies'
);

export const getCurrenciesSuccess = createAction(
  '[Transactions Effects] Get Currencies Success',
  props<{ currencies: CurrencyResult }>()
);

export const getCurrenciesFailure = createAction(
  '[Transactions Effects] Get Currencies Failure',
  props<{ error: any }>()
);


export const getAccountCurrency = createAction(
  '[Transactions Component] Get Account Currency',
  props<{ id: number }>()
);

export const getAccountCurrencySuccess = createAction(
  '[Transactions Effects] Get Account Currency Success',
  props<{ currency: string }>()
);

export const getAccountCurrencyFailure = createAction(
  '[Transactions Effects] Get Account Currency Failure',
  props<{ error: any }>()
);

export const calculateAmount = createAction(
  '[Transactions Component] Calculate Amount Currency',
  props<{ request: CalculateRateRequest }>()
);

export const calculateAmountSuccess = createAction(
  '[Transactions Effects] Calculate Amount Success',
  props<{ amount: CalculatedAmount }>()
);

export const calculateAmountFailure = createAction(
  '[Transactions Effects] Calculate Amount Failure',
  props<{ error: any }>()
);

export const getCustomCategories = createAction(
  '[Transactions Component] Get Custom Categories'
);

export const getCustomCategoriesSuccess = createAction(
  '[Transactions Component] Get Custom Categories Success',
  props<{ categories: CustomCategory[] }>()
);

export const getCustomCategoriesFailure = createAction(
  '[Transactions Component] Get Custom Categories Failure',
  props<{ error: any }>(),
);


export const loadPaginatedTransactions = createAction(
  '[Transactions Component] Load'
);

export const loadPaginatedTransactionsSuccess = createAction(
  '[Transactions Component] Load Success',
  props<{transactions:PaginatedList<Transaction>}>()
);

export const loadPaginatedTransactionsFailure = createAction(
  '[Transactions Component] Load Failure',
  props<{error:any}>()
);

export const loadPaginatedTransactionsCount = createAction(
  '[Transactions Component] Load Counts'
);

export const loadPaginatedTransactionsCountSuccess = createAction(
  '[Transactions Component] Load Counts Success',
  props<{count:CountModel}>()
);

export const loadPaginatedTransactionsCountFailure = createAction(
  '[Transactions Component] Load Counts Failure',
  props<{error:any}>()
);


export const setFilterTransactions = createAction(
  '[Transactions Component] Filter Set',
  props<{filter: Filter[]}>()
);

export const setSortTransactions = createAction(
  '[Transactions Component] Sort',
  props<{sort: Sort[]}>()
);

export const searchTransactions = createAction(
  '[Transactions Component] Search',
  props<{search: string | null}>()
);

export const setPageIndexTransactions = createAction(
  '[Transactions Component] Page index',
  props<{pageIndex: number}>()
);

export const setPageSizeTransactions = createAction(
  '[Transactions Component] Page size',
  props<{pageSize: number}>()
);

export const clearTransactionsFilter = createAction(
  '[Transactions Component] Clear filter',
);

export const clearTransactionsSort = createAction(
  '[Transactions Component] Clear sort',
);

export const clearTransactions = createAction(
  '[Transactions Component] Clear state',
);

export const loadAccountsInfo = createAction(
  '[Transactions Component] Load Accounts Info'
);

export const loadAccountsInfoSuccess = createAction(
  '[Transactions Component] Load Accounts Info Success',
  props<{info:AccountModel[]}>()
);

export const loadAccountsInfoFailure = createAction(
  '[Transactions Component] Load Accounts Info Failure',
  props<{error:any}>()
);

export const uploadTransactions = createAction(
  '[Transactions Component] Upload Transactions',
  props<{file: { fileContent: string }}>()
);

export const uploadTransactionsSuccess = createAction(
  '[Transactions Component] Upload Transactions Success',
  props<{transactions: UploadTransaction[]}>()
);

export const uploadTransactionsFailure = createAction(
  '[Transactions Component] Upload Transactions Failure',
  props<{error: any}>()
);

export const addTransactions = createAction(
  '[Transactions Component] Add Transactions',
  props<{ accountId: number }>()
);

export const addTransactionsSuccess = createAction(
  '[Transactions Effects] Add Transactions Success'
);

export const addTransactionsFailure = createAction(
  '[Transactions Effects] Add Transactions Failure',
  props<{ error: any }>()
);
