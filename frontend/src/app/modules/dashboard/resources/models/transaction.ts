import { Account } from "../../../transactions/resources/models/account-model"
import { Category } from "../../../transactions/resources/models/category"

export interface Transaction{
  id: number,
  note: string | null,
  date: Date,
  amount: number,
  type: TransactionType,
  currency: string,
  category: Category
  account: Account
}

export enum TransactionType{
  Income,
  Expense
}
