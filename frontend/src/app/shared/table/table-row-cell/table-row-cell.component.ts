import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApprovalStatus, CellEvent, TableHeaderCell, TableRowCellType } from '../table.models';

@Component({
  selector: 'app-table-row-cell',
  templateUrl: './table-row-cell.component.html',
  styleUrls: ['./table-row-cell.component.scss'],
  host: {
    '[class.checkBox]': 'isCheckBox',
    '[class.radio]': 'isRadio',
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableRowCellComponent implements OnInit {
  @Input() selectAll: boolean  | null = false;
  @Input() cell: TableHeaderCell = null!;
  @Input() data: any;
  @Output() cellEvent: EventEmitter<CellEvent> = new EventEmitter<CellEvent>();
  firstData: any;
  secondData: any;
  isCheckBox: boolean = false;
  isNone: boolean = false;
  isStatus: boolean = false;
  isTwoFlors: boolean = false;
  isWithCurrency: boolean = false;
  isWithLogo: boolean = false;
  isRadio: boolean = false;
  isMenu: boolean = false;
  isDate: boolean = false;
  isNumber=false;
  status: string | number = '';
  constructor() { }

  ngOnInit(): void {
    this.isCheckBox = (this.cell.rowType === TableRowCellType.CheckBox);
    this.isNumber = (this.cell.rowType === TableRowCellType.Number);
    this.isNone = (this.cell.rowType === TableRowCellType.None);
    this.isStatus = (this.cell.rowType === TableRowCellType.Status);
    this.isTwoFlors = (this.cell.rowType === TableRowCellType.TwoFlors);
    this.isWithCurrency = (this.cell.rowType === TableRowCellType.WithCurrency);
    this.isWithLogo = (this.cell.rowType === TableRowCellType.WithLogo);
    this.isRadio = (this.cell.rowType === TableRowCellType.Radio);
    this.isMenu = (this.cell.rowType === TableRowCellType.Menu);
    this.isDate = (this.cell.rowType === TableRowCellType.Date);
    if (this.isStatus && typeof this.data.item1 == 'string') {
      this.status = (this.data.item1 as string).toLowerCase();
    }
    else if (typeof this.data.item1 == 'number') {
      this.status = this.data.item1
    }
    if (this.isMenu) {
      this.firstData = this.data.item1;
    }
  }

  onClick(event?: any) {
    if (this.cell.rowType === TableRowCellType.CheckBox) {
      this.cellEvent.emit({ cellIndex: this.cell.id, value: event });
      return;
    }
    if (this.cell.rowType === TableRowCellType.Radio) {
      this.cellEvent.emit({ cellIndex: this.cell.id, value: true });
      return;
    }
    this.cellEvent.emit({ cellIndex: this.cell.id, value: this.data });

  }

  redBadge():boolean{
    return this.status === 'unpaid'
    || this.status === 'requiresupdates'
    || this.status === 'no'
    || this.status == ApprovalStatus.RequiresUpdates;
  }

  yellowBadge():boolean{
    return this.status  === 'inprogress'
    || this.status  === 'scheduled'
    || this.status=='pending'
    || this.status === ApprovalStatus.Pending;
  }

  greenBadge():boolean{
    return this.status === 'paid'
    || this.status === 'approved'
    || this.status === 'yes'
    || this.status === ApprovalStatus.Approved;
  }

  getStatus()
  {
    if (this.status == ApprovalStatus.RequiresUpdates) return 'Requires updates';
    if (this.status == ApprovalStatus.Pending) return 'Pending';
    if (this.status == ApprovalStatus.Approved) return '';

    if(this.status === 'none' || this.status === 3)
      return '';
    else if(this.cell.rowDataName[0] === "approvalStatus")
    {
      if(this.status === 'pending')
        return 'In Approval';
      else if(this.status === 'requiresUpdates')
        return 'Requires Upd.';
    }
    return this.status;
  }
}
