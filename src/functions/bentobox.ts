import { BigNumber } from '@ethersproject/bignumber'

export function toAmount(token: any, shares: BigNumber): BigNumber {
    console.log({ token })
    return shares.mulDiv(token.bentoAmount, token.bentoShare)
}

export function toShare(token: any, amount: BigNumber): BigNumber {
    return amount.mulDiv(token.bentoShare, token.bentoAmount)
}
