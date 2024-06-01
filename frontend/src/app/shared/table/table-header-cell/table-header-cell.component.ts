import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SortDirection, TableHeaderCell, TableHeaderCellType } from '../table.models';

@Component({
  selector: 'app-table-header-cell',
  templateUrl: './table-header-cell.component.html',
  styleUrls: ['./table-header-cell.component.scss']
})
export class TableHeaderCellComponent implements OnInit {

  @Input() cell: TableHeaderCell = null!;
  @Input() selectAll: boolean = false;
  @Output() headerEvent: EventEmitter<number> = new EventEmitter<number>();
  isCheckBox: boolean = false;
  isSortAscending: boolean = false;
  isSortDescending: boolean = false;
  isRadio: boolean = false;
  constructor() { }

  ngOnInit(): void {
    this.isCheckBox = (this.cell.type === TableHeaderCellType.CheckBox);
    this.isRadio = (this.cell.type === TableHeaderCellType.Radio);
    this.isSortAscending = this.cell.isSortAscending ?? false;
    this.isSortDescending = this.cell.isSortDescending ?? false;
  }

  ngDoCheck(): void {
    this.isCheckBox = (this.cell.type === TableHeaderCellType.CheckBox);
    this.isRadio = (this.cell.type === TableHeaderCellType.Radio);
    this.isSortAscending = (this.cell.type === TableHeaderCellType.Sort && this.cell.value === SortDirection.ascending);
    this.isSortDescending = (this.cell.type === TableHeaderCellType.Sort && this.cell.value === SortDirection.descending);
  }

  onClick() {
    if (this.cell.type === TableHeaderCellType.Sort) {
      if (this.cell.value === null) {
        this.cell.value = SortDirection.ascending;
      }
      else {
        this.cell.value = this.cell.value === SortDirection.ascending ? SortDirection.descending : SortDirection.ascending;
      }
    }
    if (this.cell.type === TableHeaderCellType.CheckBox) {
      this.cell.value = !this.cell.value;
    }
    this.headerEvent.emit(this.cell.id);
  }
}
