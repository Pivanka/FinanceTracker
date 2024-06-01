import { TransactionType } from "../../../dashboard/resources/models/transaction";

export interface Category{
  id: number,
  title: string,
  icon?: Uint8Array | string,
  type: TransactionType,
}

export interface CustomCategory{
  id: number,
  title: string,
  icon?: string,
  type: TransactionType,
  teamId: number,
  color: string
}
