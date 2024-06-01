import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, lastValueFrom, map, take } from 'rxjs';
import { Transaction } from '../../dashboard/resources/models/transaction';
import * as transactionsSelectors from '../resources/state/transactions.selector';
import * as fromTransactionsActions from '../resources/state/transactions.actions';
import { ButtonConfig } from '../../../shared/button/button.component';
import { PaginatedList } from '../../../shared/models/paginated-list';
import { Sort } from '../../../shared/models/query-params';
import { AppState } from '../../../store';
import { isSpinnerShowing } from '../../../store/selectors/spinner.selectors';
import { RowEvent, TableHeaderCell, TableHeaderCellType, TableRowCellType } from '../../../shared/table/table.models';
import { openAddTransactonModal, openEditTransactionModal } from '../../../store/actions/modal.actions';
import { selectRole } from '../../settings/resources/state/settings.selector';
import { Role } from '../../auth/resources/models/role';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss']
})
export class TransactionsTableComponent implements OnInit {

  @Input() title!: string;
  @ViewChild('menu', { static: true }) menuRef!: MatMenu;

  headerCells: TableHeaderCell[] = [];
  transactionsWithPagination$:Observable<PaginatedList<Transaction> | null> = new Observable();
  pageSize$: Observable<number>;
  selectedTransaction: Transaction | null = null;

  prevHeaderClickId?: number;
  isLoading!: Observable<boolean>;
  isEmpty!: Observable<boolean>;

  primaryButton: ButtonConfig = {
    text: 'Create new',
    onClick: () => this.store.dispatch(openAddTransactonModal())
  };
  secondaryButton: ButtonConfig = {
    text: 'Upload',
    onClick: () => alert("Click")
  };
  hasAccess$!: Observable<boolean | null>;

  constructor(private store: Store<AppState>,
    readonly router: Router) {
      this.pageSize$ = this.store.select(transactionsSelectors.selectPageSize);
  }

  ngOnInit(): void {
    this.isLoading = this.store.pipe(select(isSpinnerShowing));
    this.isEmpty = this.store.pipe(select(transactionsSelectors.transactionsEmptySelector));
    this.setHeaderCellSet();
    this.transactionsWithPagination$ = this.store.pipe(select(transactionsSelectors.selectTransactionsWithPaginator));
    this.hasAccess$ = this.store.pipe(select(selectRole)).pipe(
      map(role => role == Role.Admin || role == Role.Manager)
    );
  }

  onDeleteClick() {
    this.store.dispatch(fromTransactionsActions.deleteTransaction({ transactionId: this.selectedTransaction!.id! }))
  }

  headerClick(cellId: number) {
    var sort: Sort[] = [];
    if (this.headerCells.find(x => x.id === cellId)?.type === TableHeaderCellType.Sort) {
      var sortCell = this.headerCells.find(x => x.type === TableHeaderCellType.Sort && x.value !== null);
      if (!sortCell || !sortCell.sortName) {
        return;
      }
      sort.push({ field: sortCell.sortName, direction: sortCell.value });
      this.store.dispatch(fromTransactionsActions.setSortTransactions({ sort: sort }));
      this.store.dispatch(fromTransactionsActions.loadPaginatedTransactions());
    }
  }

  rowClick(rowEvent: RowEvent) {
    if (rowEvent.cellIndex == 6) {
      lastValueFrom(this.store.pipe(select(transactionsSelectors.selectTransaction(rowEvent.entityId)), take(1))).then((transaction) => {
        this.selectedTransaction = transaction!;
      })
    }
    else {
      lastValueFrom(this.store.pipe(select(transactionsSelectors.selectTransaction(rowEvent.entityId)), take(1))).then(transaction => {
        this.store.dispatch(openEditTransactionModal({transaction: transaction!}))
      })
    }
  }

  toPage(page: number): void {
    this.store.dispatch(fromTransactionsActions.setPageIndexTransactions({pageIndex:page-1}));
    this.store.dispatch(fromTransactionsActions.loadPaginatedTransactions());
  }

  setHeaderCellSet() {
    this.headerCells.push(
      {
        id: 1,
        order: 1,
        type: TableHeaderCellType.Sort,
        sortName: 'id',
        text: "Number",
        width: '102px',
        rowType: TableRowCellType.Invoice,
        rowDataName: ['id']
      },
      {
        id: 2,
        order: 2,
        type: TableHeaderCellType.Sort,
        sortName: 'date',
        text: "Created Date",
        width: '166px',
        rowType: TableRowCellType.Date,
        rowDataName: ['date', 'date']
      },
      {
        id: 3,
        order: 3,
        type: TableHeaderCellType.Sort,
        sortName: 'category.title',
        text: "Category",
        width: '146px',
        rowType: TableRowCellType.WithLogo,
        rowDataName: ['category.icon', 'category.title']
      },
      {
        id: 4,
        order: 4,
        type: TableHeaderCellType.Sort,
        sortName: 'amount',
        text: "Amount",
        width: '136px',
        maxWidth: '136px',
        rowType: TableRowCellType.WithCurrency,
        rowDataName: ['amount', 'currency', 'type']
      },
      {
        id: 5,
        order: 5,
        type: TableHeaderCellType.None,
        text: "Account",
        width: '90px',
        rowType: TableRowCellType.None,
        rowDataName: ['account.title']
      },
      {
        id: 6,
        order: 6,
        type: TableHeaderCellType.None,
        text: "",
        width: '90px',
        rowType: TableRowCellType.Menu,
        menuRef: this.menuRef,
        rowDataName: ['']
      }
    )
  }

}
