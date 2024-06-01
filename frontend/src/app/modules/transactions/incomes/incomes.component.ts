import { Component, OnInit } from '@angular/core';
import { DispatchingTransactionsService } from '../resources/services/dispatch-transactions.service';

@Component({
  selector: 'app-incomes',
  templateUrl: './incomes.component.html'
})
export class IncomesComponent implements OnInit {

  constructor(private service: DispatchingTransactionsService) {
  }

  ngOnInit(): void {
    this.service.dispatchTransactions('Income');
  }

}
