import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface FailedModalRedirectButton{
  label: string,
  route?: string,
}

export interface FailedModalRedirectData{
  primaryButton: FailedModalRedirectButton,
}

@Component({
  selector: 'app-failed-modal-redirect',
  templateUrl: './failed-modal-redirect.component.html',
  styleUrls: ['./failed-modal-redirect.component.scss']
})
export class FailedModalRedirectComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: FailedModalRedirectData) { }

  ngOnInit(): void {
  }

}
