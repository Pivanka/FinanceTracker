import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-title',
  template: `
    <h1 mat-dialog-title class="modal-title" [style.padding-top]="paddingTop">{{text}}</h1>
  `,
  styles: [
    `.modal-title{
       font-weight: 500;
       font-size: 32px;
       line-height: 48px;
    }`
  ]
})
export class ModalTitleComponent implements OnInit {

  @Input() text!: string;
  @Input("padding-top") paddingTop?: string;
  constructor() { }

  ngOnInit(): void {
  }

}
