import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableHeaderCell, CellEvent, TableRowCellType, RowEvent } from '../table.models';

@Component({
  selector: 'app-table-row',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableRowComponent implements OnInit {

  @Input() idName: string = 'id';
  @Input() selectAll: boolean = false;
  @Input() rowIndex: number = 0;
  @Input() data: any;
  @Input() cells: TableHeaderCell[] = [];
  @Output() rowEvent: EventEmitter<RowEvent> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.cells.sort(({order:a}, {order:b}) => a-b);
    // this.cells.sort(x => x.order);
  }

  onClick(cellEvent: CellEvent) {
    this.rowEvent.emit({ rowIndex: this.rowIndex, cellIndex: cellEvent.cellIndex, entityId: this.data[this.idName], value: cellEvent.value });
  }

  getCellData(cell: TableHeaderCell): any {
    if (cell.rowType === (TableRowCellType.None || TableRowCellType.Status)) {
      return { item1: this.data[cell.rowDataName[0]] };
    }
    if(cell.rowType === TableRowCellType.CheckBox){
          return { item1: false };
    }
    if(cell.rowType  === TableRowCellType.Radio){
      return { item1: false, item2: this.data[cell.rowDataName[0]]};
    }
    if (cell.rowType === TableRowCellType.Menu) {
      return { item1: cell.menuRef }
    }
    return { item1: this.getProp(cell.rowDataName[0], this.data), item2: this.getProp(cell.rowDataName[1], this.data), item3: this.getProp(cell.rowDataName[2], this.data) };
  }
  getProp(path: string, obj: any): any {
    if (!path) return null;
     return path.split('.').reduce((p, c) => p && p[c] || null, obj)
  }
}
