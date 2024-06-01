import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-generic-error-message',
  templateUrl: './generic-error-message.component.html',
  styleUrls: ['./generic-error-message.component.scss']
})
export class GenericErrorMessageComponent implements OnInit {
  @Input("control") control!: AbstractControl<any, any>;
  @Input() message?: string;
  constructor() { }

  ngOnInit() {
  }

}
