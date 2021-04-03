import { BigNumber } from "@ethersproject/bignumber"

export function toAmount(token: any, shares: BigNumber) {
  return shares.muldiv(token.bentoAmount, token.bentoShare)
}

export function toShare(token: any, shares: BigNumber) {
  return shares.muldiv(token.bentoShare, token.bentoAmount)
}
  