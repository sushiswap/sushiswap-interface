import { BigNumber } from '@ethersproject/bignumber'
import JSBI from 'jsbi'
import { ZERO, Rebase } from '@sushiswap/core-sdk'

export function toAmount(token, shares: BigNumber): BigNumber {
  return shares.mulDiv(token.bentoAmount, token.bentoShare)
}

export function toShare(token, amount: BigNumber): BigNumber {
  return amount.mulDiv(token.bentoShare, token.bentoAmount)
}

export function toAmountJSBI(token: Rebase, shares: JSBI): JSBI {
  return JSBI.GT(token.base, 0) ? JSBI.divide(JSBI.multiply(shares, token.elastic), token.base) : ZERO
}

export function toShareJSBI(token: Rebase, amount: JSBI): JSBI {
  return JSBI.GT(token.elastic, 0) ? JSBI.divide(JSBI.multiply(amount, token.base), token.elastic) : ZERO
}
