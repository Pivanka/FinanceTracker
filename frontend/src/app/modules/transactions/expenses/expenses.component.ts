import { Component, OnInit } from '@angular/core';
import { DispatchingTransactionsService } from '../resources/services/dispatch-transactions.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html'
})
export class ExpensesComponent implements OnInit {

  constructor(private service: DispatchingTransactionsService) {
  }

  ngOnInit(): void {
    this.service.dispatchTransactions('Expense');
  }

}
