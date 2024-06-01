import { Component, OnInit } from '@angular/core';
import { DispatchingTransactionsService } from '../resources/services/dispatch-transactions.service';

@Component({
  selector: 'app-all-transactions',
  templateUrl: './all-transactions.component.html'
})
export class AllTransactionsComponent implements OnInit {

  constructor(private service: DispatchingTransactionsService) {
  }

  ngOnInit(): void {
    this.service.dispatchTransactions('All');
  }
}
