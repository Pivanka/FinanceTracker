import { Component, OnInit } from '@angular/core';
import { Notification } from '../resources/models/notification';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PaginatedList } from '../../../shared/models/paginated-list';
import { AppState } from '../../../store';
import * as fromDashboardActions from '../resources/state/dashboard.actions';
import { selectNotifications } from '../resources/state/dashboard.selectors';
import { SignalRService } from '../../../core/resources/services/signalR.service';
import { openNotificationModal } from '../../../store/actions/modal.actions';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications$?: Observable<PaginatedList<Notification> | null>;

  constructor(private store: Store<AppState>, private signalR: SignalRService) {
    signalR.addNotificationListener(() => {
      this.store.dispatch(fromDashboardActions.loadNotifications({ take: 4 }));
    })
  }

  ngOnInit() {
    this.notifications$ = this.store.pipe(select(selectNotifications));
    this.store.dispatch(fromDashboardActions.loadNotifications({ take: 4 }));
 }

  viewAll(){
    this.store.dispatch(fromDashboardActions.openNotificationsModal());
  }

  openNotificationModal(item: Notification) {
    this.store.dispatch(openNotificationModal({ notification: item }));
    if(item.isRead === false) {
      this.store.dispatch(fromDashboardActions.loadNotifications({ take: 4 }));
    }
  }

}
