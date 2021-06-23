import { BigNumber } from '@ethersproject/bignumber'

export function toAmount(token, shares: BigNumber): BigNumber {
  return shares.mulDiv(token.bentoAmount, token.bentoShare)
}

export function toShare(token, amount: BigNumber): BigNumber {
  return amount.mulDiv(token.bentoShare, token.bentoAmount)
}
