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
  amount: number,
  type: RequirementType
}

export enum RequirementType {
  Min,
  Max
}
