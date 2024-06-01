export interface QueryParams {
  filter: Filter[];
  search: string | null;
  sort: Sort[];
  pageIndex:number;
  pageSize:number;
}

export interface Filter{
  key:string,
  value:string,
  filterType: FilterType
}

export enum FilterType{
  equals,
  notEqual,
  greaterThanOrEqual,
  greaterThan,
  lessThanOrEqual,
  lessThan
}

export interface Sort{
  field:string,
  direction:SortDirection
}

export enum SortDirection{
  ascending,
  descending
}
