import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableHeaderCell, TableHeaderCellType } from '../table.models';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss']
})
export class TableHeaderComponent implements OnInit {
  @Input() cells: TableHeaderCell[] = [];
  @Input() selectAll: boolean = false;
  @Output() headerEvent: EventEmitter<number> = new EventEmitter();
  constructor(private cdr: ChangeDetectorRef) { }
  ngAfterContentInit(): void {

  }

  ngOnInit(): void {
    this.cells.sort(({order:a}, {order:b}) => a-b);
  }

  isCheckBox(cell: TableHeaderCell) {
    return cell.type === TableHeaderCellType.CheckBox;
  }

  onClick(cellId: number) {
    var emitedCell = this.cells.find(x => x.id === cellId);
    if (emitedCell?.type === TableHeaderCellType.Sort) {
      var cellsDisableSort = this.cells.filter(x => x.type === TableHeaderCellType.Sort && x.id !== cellId);
      cellsDisableSort.forEach(x => x.value = null);
    }
    this.headerEvent.emit(cellId);
  }

}
