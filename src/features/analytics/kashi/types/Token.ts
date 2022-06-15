export type Token = {
  id: string
  name: string
  symbol: string
  decimals: BigInt
  totalSupply?: BigInt
  totalSupplyElastic?: BigInt
  totalSupplyBase?: BigInt
  price?: BigInt
  block?: BigInt
  timestamp?: BigInt
}
