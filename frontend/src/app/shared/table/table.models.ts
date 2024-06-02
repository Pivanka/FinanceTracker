import { MatMenu } from '@angular/material/menu';

export enum TableHeaderCellType{
  None,
  Sort,
  CheckBox,
  Radio
}

export interface TableHeaderCell{
  id:number,
  type:TableHeaderCellType,
  order:number,
  sortName?:string,
  minWidth?: string,
  flex?:string,
  maxWidth?:string,
  width?:string,
  text?:string,
  value?:any
  rowType:TableRowCellType,
  rowDataName: string[],
  menuRef?: MatMenu,
  isSortAscending?: boolean,
  isSortDescending?: boolean,
}

export enum TableRowCellType{
  None,
  CheckBox,
  TwoFlors,
  WithLogo,
  WithCurrency,
  Status,
  Radio,
  Menu,
  Number,
  Date
}

export enum SortDirection{
  ascending,
  descending
}

export interface CellEvent{
  cellIndex:number,
  value:any
}
export enum ApprovalStatus {
  None,
  Approved,
  Pending,
  RequiresUpdates
}

export interface RowEvent{
  rowIndex:number,
  cellIndex:number,
  entityId:number,
  value:any
}
