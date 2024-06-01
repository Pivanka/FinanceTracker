export interface Notification {
  id: number,
  type: NotificationOperationsModel,
  message: string,
  createdDate: Date,
  isRead: boolean
}

export enum NotificationOperationsModel {
  None,
  ChangePasswordByInvitation,
  InvitationApproved,
  ChangedRole,
  ChangedCurrency
}
