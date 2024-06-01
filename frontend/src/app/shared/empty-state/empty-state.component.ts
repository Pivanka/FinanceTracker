import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent implements OnInit {

  @Input() icon: string = "assets/images/icons/empty_icon.svg"
  @Input() message: string = "There is nothing here."
  constructor() { }

  ngOnInit(): void {
  }

}
