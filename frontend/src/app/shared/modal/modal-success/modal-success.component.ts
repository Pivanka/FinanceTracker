import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-success',
  templateUrl: './modal-success.component.html',
  styleUrls: ['./modal-success.component.scss']
})
export class ModalSuccessComponent implements OnInit {

  @Input() successful:boolean = true;
  @Input() text!: string;
  @Input() title!: string;
  constructor() { }

  ngOnInit(): void {
  }

}
