import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormControlState } from '@angular/forms';


@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @Input() control: FormControl | null = null;
  @Input() label: string = "";
  @Input() placeholder: string = "text"
  @Input() prefix?: string;
  @Input() errorMessage: string = ""
  @Input() type: string = "text"
  @Input() controlState: FormControlState<any> | null = null;
  @Input() defaultValue?: string;
  @Input() min?: string;
  @Input() disabled = false;

  @Input() currencyConfig: any = undefined
  @Input() displayClearButton: boolean = true
  @ViewChild('inputElement') inputElement?: ElementRef;

  @Output() input = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
    if (!this.control && !this.controlState) {
      this.control = new FormControl();
    }
    if (this.defaultValue) {
      this.control?.setValue(this.defaultValue);
    }
  }

  onClear() {
    this.control?.reset();
  }

  onChangeType($event: MouseEvent) {
    const native = this.inputElement?.nativeElement as HTMLInputElement;
    native.type = (native.type == 'text' ? 'password' : 'text');
  }

  onInput() {
    this.input.emit();
  }
}
