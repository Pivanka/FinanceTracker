import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as TransactionsReducer from "./transactions.reducer";
import { TransactionType } from "../../../dashboard/resources/models/transaction";

const selectTransactions = createFeatureSelector<TransactionsReducer.State>(
  TransactionsReducer.transactionsFeatureKey
);

export const transactionsLoadingSelector = createSelector(
    selectTransactions,
    (state: TransactionsReducer.State) => { return state.transactionsLoading }
)

export const selectCategories = createSelector(
  selectTransactions,
  (state: TransactionsReducer.State) => {
      return state.categories
  }
);

export const showCategoriesSelector = (type: TransactionType, search: string) => createSelector(
  selectCategories,
  (categories) => {
    let filtered = categories!.filter(category => category.type === type && category.title.toLowerCase().includes(search.toLocaleLowerCase()))
    return filtered
  }
);

export const selectAccounts = createSelector(
  selectTransactions,
  (state: TransactionsReducer.State) => {
      return state.accounts
  }
);

export const selectCurrencies = createSelector(
  selectTransactions,
  (state: TransactionsReducer.State) => {
      return state.currencies
  }
);

export const selectAmount = createSelector(
  selectTransactions,
  (state: TransactionsReducer.State) => {
      return state.amount
  }
);

export const selectCustomCategories = createSelector(
  selectTransactions,
  (state: TransactionsReducer.State) => {
      return state.customCategories
  }
);

export const showCustomCategoriesSelector = (type: TransactionType, search: string) => createSelector(
  selectCustomCategories,
  (categories) => {
    let filtered = categories!.filter(category => category.type === type && category.title.toLowerCase().includes(search.toLocaleLowerCase()))
    return filtered
  }
);

export const selectParams = createSelector(
  selectTransactions,
  state => state.params
);

export const selectPageSize = createSelector(
  selectParams,
  state => state.pageSize
);

export const selectTransactionsWithPaginator = createSelector(
  selectTransactions,
  state => state.transactionsP
);

export const transactionsEmptySelector = createSelector(
  selectTransactionsWithPaginator,
  state => state?.totalCount === 0
);

export const selectTransactionsCount = createSelector(
  selectTransactions,
  state => state.transactionsCount
);

export const selectAccountInfo = createSelector(
  selectTransactions,
  state => state.accountsInfo
);

export const selectTransaction = (id: number) => createSelector(
  selectTransactions,
  (state) => {
    return state.transactionsP!.items.find(x => x.id === id)
  }
)

export const uploadedTransactionSelector = createSelector(
  selectTransactions,
  (state: TransactionsReducer.State) => state.uploadedTransactions
)
