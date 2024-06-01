import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { closeModals } from '../../../store/actions/modal.actions';

@Component({
  selector: 'app-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrls: ['./modal-container.component.scss']
})
export class ModalContainerComponent implements OnInit {

  @Input() maxWidth?: string;
  @Input() minWidth: string = '300px';
  @Input() minHeight: string = '200px';
  @Input() maxHeight?: string;
  @Input() showClose = true;
  constructor(private store: Store<AppState>) { }

  close() {
    this.store.dispatch(closeModals());
  }

  ngOnInit(): void {
  }

}
