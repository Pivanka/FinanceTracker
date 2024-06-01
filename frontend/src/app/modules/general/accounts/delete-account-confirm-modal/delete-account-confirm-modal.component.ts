import { Component, Inject, OnInit } from '@angular/core';
import { ButtonConfig } from '../../../../shared/button/button.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface RequestConfirmData {
  title: string;
  primaryButton: ButtonConfig;
  declineButton: ButtonConfig;
}

@Component({
  selector: 'app-delete-account-confirm-modal',
  templateUrl: './delete-account-confirm-modal.component.html',
  styleUrls: ['./delete-account-confirm-modal.component.scss']
})
export class DeleteAccountConfirmModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: RequestConfirmData) { }

  ngOnInit(): void {
  }

}
