
export interface AccountModel{
  id: number,
  title: string,
  icon?: Uint8Array | string,
  transactionsCount: number;
}

export interface Account{
  id: number,
  title: string,
  icon?: Uint8Array | string,
  currency: string
}
