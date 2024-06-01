import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SimpleChart } from '../resources/models/simple-chart';
import { Store, select } from '@ngrx/store';
import { loadChart } from '../resources/state/reports.actions';
import { selectChart } from '../resources/state/reports.selectors';
import { TransactionType } from '../../dashboard/resources/models/transaction';
import { AppState } from '../../../store';
import { DateItemModel } from '../../../shared/date-item/date-item.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-incomes-reports',
  templateUrl: './incomes-reports.component.html',
  styleUrls: ['./incomes-reports.component.scss']
})
export class IncomesReportsComponent implements OnInit {

  chart$?:Observable<SimpleChart | null>
  currentWeek!: {to:Date, from: Date};
  dates!: DateItemModel[];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.currentWeek = {
      to: new Date(),
      from: this.getStartOfWeek()
    };
    this.dates = [
      {
        title: 'Current week',
        to: this.currentWeek.to,
        from: this.currentWeek.from
      },
      {
        title: 'Current mounth',
        to: new Date(),
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      },
      {
        title: 'Current year',
        to: new Date(),
        from: new Date(new Date().getFullYear(), 0, 1)
      },
      {
        title: 'All time'
      }
    ]
    this.store.dispatch(loadChart({transactionType: TransactionType.Income, to: new Date().toISOString(), from: this.getStartOfWeek().toISOString()}))
    this.chart$ = this.store.select(selectChart);
  }

  getStartOfWeek() {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - currentDay);

    return startOfWeek;
  }
  customDate!: { start?: Date, end?: Date };
  onDateChange(event: MatDatepickerInputEvent<Date>) {
    if(this.range.value.end !== null && this.range.value.start !== null) {
      this.store.dispatch(loadChart({transactionType: TransactionType.Income, to: this.range.value.end!.toISOString(), from: this.range.value.start!.toISOString()}));
    }
  }

  onClick(item: DateItemModel){
    this.store.dispatch(loadChart({transactionType: TransactionType.Income, to: item.to?.toISOString(), from: item.from?.toISOString()}));
  }

}
