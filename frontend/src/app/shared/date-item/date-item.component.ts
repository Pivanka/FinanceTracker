import { Component, Input, OnInit } from '@angular/core';

export interface DateItemModel {
  title: string;
  from?: Date;
  to?: Date;
}

@Component({
  selector: 'app-date-item',
  templateUrl: './date-item.component.html',
  styleUrls: ['./date-item.component.scss']
})
export class DateItemComponent implements OnInit {

  @Input() model!: DateItemModel;

  constructor() { }

  ngOnInit(): void { }

}
