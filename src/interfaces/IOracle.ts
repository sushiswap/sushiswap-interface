export interface IOracle {
  address: string
  name: string
  data: string
  warning?: string
  error?: string
  valid?: boolean
}
