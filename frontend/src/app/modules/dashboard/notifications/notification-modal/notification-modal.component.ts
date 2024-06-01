import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Notification } from '../../resources/models/notification';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { readNotififcation } from '../../resources/state/dashboard.actions';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss']
})
export class NotificationModalComponent implements OnInit {

  constructor(private store: Store<AppState>,
    public dialogRef: MatDialogRef<NotificationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Notification) { }

  ngOnInit() {
    if(this.data.isRead === false) {
      this.store.dispatch(readNotififcation({ notificationId: this.data.id }));
    }
  }

}
