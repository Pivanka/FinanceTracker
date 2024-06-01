import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type ButtonConfig = {
  text: string;
  onClick: any;
  disabled?: boolean;
}

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() variant: 'outlined' | 'standard' | 'decline' = 'standard';
  @Input() config?: ButtonConfig;
  @Input() text?: string;
  @Input() disabled?: boolean;
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  @Input() stretch: boolean = false;
  @Input() type: 'button'|'submit'|'reset' | '' = "button";
  @Input() classList: string[] = [];

  constructor() { }

  click() {
    this.onClick.emit();
  }

  ngOnInit(): void {
  }
}
