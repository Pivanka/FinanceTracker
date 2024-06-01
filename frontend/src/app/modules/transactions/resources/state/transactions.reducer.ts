import { createReducer, on } from '@ngrx/store';
import * as TransactionsActions from './transactions.actions';
import { Category, CustomCategory } from '../models/category';
import { Account, AccountModel } from '../models/account-model';
import { CalculatedAmount, CurrencyModel } from '../models/currency';
import { CountModel } from '../models/count-model';
import { PaginatedList } from '../../../../shared/models/paginated-list';
import { QueryParams } from '../../../../shared/models/query-params';
import { SortDirection } from '../../../../shared/table/table.models';
import { Transaction } from '../../../dashboard/resources/models/transaction';
import { UploadTransaction } from '../models/upload-transaction';

export const transactionsFeatureKey = 'transactions';

export interface State {
  transactionsLoading: boolean,
  error: any,

  categories: Category[] | null,
  accounts: Account[],
  currencies: CurrencyModel[],
  amount?: CalculatedAmount,
  customCategories: CustomCategory[] | null,

  params: QueryParams,
  transactionsP: PaginatedList<Transaction> | null;
  transactionsCount: CountModel | null;
  accountsInfo: AccountModel[] | null;

  uploadedTransactions: UploadTransaction[] | null;
}

export const initialState: State = {
  transactionsLoading: true,
  error: null,
  categories: null,
  accounts: [],
  currencies: [],
  customCategories: null,
  transactionsP: null,
  params: {
    filter: [],
    search: '',
    sort: [{ field: 'date', direction: SortDirection.descending }],
    pageIndex:0,
    pageSize:5
  },
  transactionsCount: null,
  accountsInfo: null,
  uploadedTransactions: null
};

export const reducer = createReducer(
  initialState,

  on(TransactionsActions.setLoading, (state, action) => {
    return {
      ...state,
      invoicesLoading: action.loading
    };
  }),
  on(TransactionsActions.addTransactionFailure, (state, action) => {
    return {
      ...state,
      error: action.error
    };
  }),
  on(TransactionsActions.setSortProp, (state, action) => {
    return {
      ...state,
      sortByProp: action.prop,
      sortAscending: false,
    }
  }),
  on(TransactionsActions.setAccountFilter, (state, action) => {
    return {
      ...state,
      accountFilter: action.filter
    }
  }),
  on(TransactionsActions.getCategoriesSuccess, (state, action) => {
    return {
      ...state,
      categories: action.categories
    }
  }),
  on(TransactionsActions.getCategoriesFailure, (state, action) => {
    return {
      ...state,
      error: action.error
    }
  }),
  on(TransactionsActions.getAccountsSuccess, (state, action) => {
    return {
      ...state,
      accounts: action.accounts
    }
  }),
  on(TransactionsActions.getAccountCurrencyFailure, (state, action) => {
    return {
      ...state,
      error: action.error
    }
  }),
  on(TransactionsActions.getCurrenciesSuccess, (state, action) => {
    return {
      ...state,
      currencies: action.currencies.currencies
    }
  }),
  on(TransactionsActions.getCurrenciesFailure, (state, action) => {
    return {
      ...state,
      error: action.error
    }
  }),
  on(TransactionsActions.calculateAmountSuccess, (state, action) => {
    return {
      ...state,
      amount: action.amount
    }
  }),
  on(TransactionsActions.calculateAmountFailure, (state, action) => {
    return {
      ...state,
      error: action.error
    }
  }),
  on(TransactionsActions.getCustomCategoriesSuccess, (state, action) => {
    return {
      ...state,
      customCategories: action.categories
    }
  }),
  on(TransactionsActions.getCustomCategoriesFailure, (state, action) => {
    return {
      ...state,
      error: action.error
    }
  }),
  on(TransactionsActions.setFilterTransactions, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        filter: state.params.filter.concat(action.filter),
        pageIndex:0
      }
    };
  }),
  on(TransactionsActions.setSortTransactions, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        sort:action.sort,
        pageIndex:0
      }
    };
  }),
  on(TransactionsActions.searchTransactions, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        search:action.search
      }
    };
  }),
  on(TransactionsActions.setPageIndexTransactions, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        pageIndex:action.pageIndex
      }
    };
  }),
  on(TransactionsActions.setPageSizeTransactions, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        pageSize:action.pageSize
      }
    };
  }),
  on(TransactionsActions.clearTransactionsFilter, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        filter:[]
      }
    };
  }),
  on(TransactionsActions.clearTransactionsSort, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        sort:[{ field: 'date', direction: SortDirection.descending }]
      }
    };
  }),
  on(TransactionsActions.loadPaginatedTransactions, (state, action) => {
    return {
      ...state,
      transactionsP:null
    };
  }),
  on(TransactionsActions.loadPaginatedTransactionsSuccess, (state, action) => {
    return {
      ...state,
      transactionsP:action.transactions,
      error:null
    };
  }),
  on(TransactionsActions.loadPaginatedTransactionsFailure, (state, action) => {
    return {
      ...state,
      error:action.error
    };
  }),
  on(TransactionsActions.clearTransactions, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        filter: state.params.filter.filter(x => x.key === 'account'),
        sort: [{ field: 'date', direction: SortDirection.descending }],
        pageIndex:0,
        pageSize:5
      },
      transactionsP: null
    };
  }),
  on(TransactionsActions.loadPaginatedTransactionsCountSuccess, (state, action) => {
    return {
      ...state,
      transactionsCount: action.count
    };
  }),
  on(TransactionsActions.loadPaginatedTransactionsCountFailure, (state, action) => {
    return {
      ...state,
      error: action.error
    };
  }),
  on(TransactionsActions.loadAccountsInfoSuccess, (state, action) => {
    return {
      ...state,
      accountsInfo: action.info
    };
  }),
  on(TransactionsActions.loadAccountsInfoFailure, (state, action) => {
    return {
      ...state,
      error: action.error
    };
  }),
  on(TransactionsActions.uploadTransactionsSuccess, (state, action) => {
    return {
      ...state,
      uploadedTransactions: action.transactions,
      error: "yes"
    };
  }),
  on(TransactionsActions.addTransactionsFailure, (state, action) => {
    return {
      ...state,
      error: action.error
    };
  }),
);
