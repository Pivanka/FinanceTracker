import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../store';
import { TransactionType } from '../../dashboard/resources/models/transaction';
import { SimpleChart } from '../resources/models/simple-chart';
import { loadChart } from '../resources/state/reports.actions';
import { selectChart, selectIsLoading } from '../resources/state/reports.selectors';
import { DateItemModel } from '../../../shared/date-item/date-item.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { FormGroup, FormControl } from '@angular/forms';
import { isSpinnerShowing } from '../../../store/selectors/spinner.selectors';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-expences-reports',
  templateUrl: './expences-reports.component.html',
  styleUrls: ['./expences-reports.component.scss'],
  providers: [provideNativeDateAdapter()],
})
export class ExpencesReportsComponent implements OnInit {

  chart$?:Observable<SimpleChart | null>
  isLoading$?:Observable<boolean>
  constructor(private store: Store<AppState>) { }

  currentWeek!: {to:Date, from: Date};
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
    this.store.dispatch(loadChart({transactionType: TransactionType.Expense, to: this.currentWeek.to.toISOString(), from: this.currentWeek.from.toISOString()}))
    this.chart$ = this.store.select(selectChart);
    this.isLoading$ = this.store.select(isSpinnerShowing);
  }

  selected?: {startDate: any, endDate: any};
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  dates!: DateItemModel[];

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
      this.store.dispatch(loadChart({transactionType: TransactionType.Expense, to: this.range.value.end!.toISOString(), from: this.range.value.start!.toISOString()}));
    }
  }

  onClick(item: DateItemModel){
    this.store.dispatch(loadChart({transactionType: TransactionType.Expense, to: item.to?.toISOString(), from: item.from?.toISOString()}));
  }
}

