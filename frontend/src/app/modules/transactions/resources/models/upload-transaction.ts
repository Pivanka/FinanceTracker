import { TransactionType } from "../../../dashboard/resources/models/transaction";

export interface UploadTransaction{
  note: string | null,
  date: Date,
  amount: number,
  type: TransactionType,
  currency: string,
  exchangeRate: number
}
