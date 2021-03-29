import { getOracleName } from '../functions'

export interface Oracle {
  address: string
  name: string
  data: string
  validate(): boolean
}

export class Oracle implements Oracle {
  constructor(address: string, data: string) {
    this.address = address.toLowerCase()
    this.name = getOracleName(address)
    this.data = data
    // this.validator = getOracleValidator(address)
  }
  validate(): boolean {
    return true
  }
}
