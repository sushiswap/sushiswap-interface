import { ethers } from 'ethers'
import { Token, TokenAmount } from '@sushiswap/sdk'

export default interface LPToken {
  id?: number
  address: string
  tokenA: Token
  tokenB: Token
  totalSupply: ethers.BigNumber
  balance: TokenAmount
  name?: string
  symbol?: string
  decimals?: number
}
