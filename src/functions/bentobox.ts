import { BigNumber } from '@ethersproject/bignumber'
import { CurrencyAmount, JSBI, Rebase, Token, ZERO } from '@figswap/core-sdk'

// export function toAmount(token, shares: BigNumber): BigNumber {
//   // console.log('toAmount', token, shares)
//   return shares.mulDiv(token.bentoAmount, token.bentoShare)
// }

// export function toShare(token, amount: BigNumber): BigNumber {
//   // console.log('toShare', token, shares)
//   return amount.mulDiv(token.bentoShare, token.bentoAmount)
// }

export function toAmount(rebase: Rebase, shares: BigNumber): BigNumber {
  // console.log('toAmount', token, shares)
  return shares.mulDiv(BigNumber.from(rebase.elastic.toString()), BigNumber.from(rebase.base.toString()))
}

export function toShare(rebase: Rebase, amount: BigNumber): BigNumber {
  // console.log('toShare', token, shares)
  return amount.mulDiv(BigNumber.from(rebase.base.toString()), BigNumber.from(rebase.elastic.toString()))
}

export function toAmountJSBI(rebase: Rebase, shares: JSBI, roundUp = false): JSBI {
  if (JSBI.EQ(rebase.base, ZERO)) return shares

  const elastic = JSBI.divide(JSBI.multiply(shares, rebase.elastic), rebase.base)

  if (roundUp && JSBI.LT(JSBI.divide(JSBI.multiply(elastic, rebase.base), rebase.elastic), shares)) {
    return JSBI.add(elastic, JSBI.BigInt(1))
  }

  return elastic
}

export function toShareJSBI(rebase: Rebase, amount: JSBI, roundUp = false): JSBI {
  if (JSBI.EQ(rebase.elastic, ZERO)) return amount

  const base = JSBI.divide(JSBI.multiply(amount, rebase.base), rebase.elastic)

  if (roundUp && JSBI.LT(JSBI.divide(JSBI.multiply(base, rebase.elastic), rebase.base), amount)) {
    return JSBI.add(base, JSBI.BigInt(1))
  }

  return base
}

export function toAmountCurrencyAmount(token: Rebase, shares: CurrencyAmount<Token>, roundUp = false) {
  const amount = toAmountJSBI(token, shares.quotient, roundUp)
  return CurrencyAmount.fromRawAmount(shares.currency, amount)
}

export function toShareCurrencyAmount(token: Rebase, amount: CurrencyAmount<Token>, roundUp = false) {
  const share = toShareJSBI(token, amount.quotient, roundUp)
  return CurrencyAmount.fromRawAmount(amount.currency, share)
}
