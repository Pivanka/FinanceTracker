import { Component, Input, OnInit } from '@angular/core';
import { ButtonConfig } from '../button/button.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() title!: string;
  @Input() icon!: string;
  @Input() primaryButton?: ButtonConfig;
  @Input() secondaryButton?: ButtonConfig;
  constructor() { }

  ngOnInit(): void {
  }

}
