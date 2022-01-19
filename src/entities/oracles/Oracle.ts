import { ChainId } from '@sushiswap/core-sdk'

export abstract class Oracle {
  chainId = ChainId.ETHEREUM
  address = ''
  data = ''
  name = ''
  warning = ''
  error = ''
  // @ts-ignore TYPE NEEDS FIXING
  constructor(chainId, address, name, data) {
    this.chainId = chainId
    this.address = address
    this.data = data
    this.name = name
  }
}
