
export interface CurrencyResult{
  currencies: CurrencyModel[]
}

export interface CurrencyModel{
  ISOnum: number,
  currency: string,
  name: string,
  symbol: string,
}

export interface CalculateRateRequest{
  amount: number,
  accountCurrency: string,
  selectedCurrency: string,
}

export interface CalculatedAmount {
  amount: number,
  exchangeRate: number
}
