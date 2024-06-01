import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface SuccessModalRedirectButton{
  label: string,
  route?: string,
}

export interface SuccessModalRedirectData{
  title?:string,
  text: string,
  maxWidth?:string,
  primaryButton?: SuccessModalRedirectButton,
  secondaryButton?: SuccessModalRedirectButton,
  unsuccessful?:boolean
}

@Component({
  selector: 'app-success-modal-redirect',
  templateUrl: './success-modal-redirect.component.html',
  styleUrls: ['./success-modal-redirect.component.scss']
})

export class SuccessModalRedirectComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: SuccessModalRedirectData) { }

  ngOnInit(): void {
  }

}
