import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-transactions-table-wrapper',
  templateUrl: './transactions-table-wrapper.component.html',
  styleUrls: ['./transactions-table-wrapper.component.scss']
})
export class TransactionsTableWrapperComponent implements OnInit {

  @Input() title = '';
  @Input() subTitle = '';
  constructor() { }

  ngOnInit() {
  }

}
