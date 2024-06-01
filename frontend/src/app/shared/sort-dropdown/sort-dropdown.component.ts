import { Component, ContentChild, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sort-dropdown',
  templateUrl: './sort-dropdown.component.html',
  styleUrls: ['./sort-dropdown.component.scss']
})
export class SortDropdownComponent implements OnInit {
  isListOpen: boolean = false;
  selectedItem: number = -1;

  @ViewChild('dropitems') dropItems!: ElementRef;
  @ContentChild('header', {static: false} ) headerTemplateRef!: TemplateRef<any>;
  @ContentChild('body', {static: false} ) bodyTemplateRef!: TemplateRef<any>;

  @Input() items: any[] = []
  @Input() width: string = 'max-content';
  @Input() menuColor = 'white';

  @Input() displaySelected = false;
  @Input() selectFirst = true;
  @Input() closeAfterSelecting = false;

  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    if (this.selectFirst)
      this.select(0);
  }

  openSelectList() {
    this.isListOpen = !this.isListOpen;
  }

  closeSelectList() {
    this.isListOpen = false;
  }

  select(index: number){
    this.selectedItem = index;
    this.onSelect.emit(this.items[index]);

    if (this.closeAfterSelecting)
      this.closeSelectList();
  }
}
