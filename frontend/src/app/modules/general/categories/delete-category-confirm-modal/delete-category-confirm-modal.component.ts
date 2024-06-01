import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequestConfirmData } from '../../accounts/delete-account-confirm-modal/delete-account-confirm-modal.component';

@Component({
  selector: 'app-delete-category-confirm-modal',
  templateUrl: './delete-category-confirm-modal.component.html',
  styleUrls: ['./delete-category-confirm-modal.component.scss']
})
export class DeleteCategoryConfirmModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: RequestConfirmData) { }

  ngOnInit(): void {
  }

}
