import { Component, OnInit } from '@angular/core';
import { loadTransactions } from './resources/state/dashboard.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(loadTransactions({ take: 4 }));
  }

}
