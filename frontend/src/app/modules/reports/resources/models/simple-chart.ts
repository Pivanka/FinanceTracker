export interface SimpleChart {
  values: Value[],
  currency: string
}

export interface Value {
  categoryTitle: string,
  amount: number,
  color: string
}
