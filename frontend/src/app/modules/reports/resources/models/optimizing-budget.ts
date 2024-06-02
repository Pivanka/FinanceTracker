export interface OptimizeBudgetResult {
  result: OptimizeResultItem[]
}

export interface OptimizeResultItem {
  category: string,
  amount: number
}

export interface OptimizeBudgetRequest {
  budget: number,
  items: OptimizeRequestItem[]
}

export interface OptimizeRequestItem {
  categoryId?: number,
  customCategoryId?: number,
  maxAmount: number,
  minAmount: number
}
