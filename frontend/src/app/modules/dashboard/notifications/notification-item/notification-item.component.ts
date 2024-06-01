import { Component, Input, OnInit } from '@angular/core';
import { Notification, NotificationOperationsModel } from '../../resources/models/notification';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent implements OnInit {
  @Input() notification?: Notification;

  constructor() { }

  ngOnInit(): void { }

  getIconByOperation(): string {
    if(this.notification?.type === NotificationOperationsModel.InvitationApproved){
      return "assets/images/icons/inv_acceted.svg";
    } else if(this.notification?.type === NotificationOperationsModel.ChangePasswordByInvitation) {
      return "assets/images/icons/change_pass.svg";
    } else if(this.notification?.type === NotificationOperationsModel.ChangedRole) {
      return "assets/images/icons/changed_role.svg";
    } else if(this.notification?.type === NotificationOperationsModel.ChangedCurrency) {
      return "assets/images/icons/changed_currency.svg";
    }

    return "assets/images/icons/approval.svg";
  }

}
