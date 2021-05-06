import {
    BigintIsh,
    Currency,
    CurrencyAmount,
    ETHER,
    Pair,
    Route,
    Token,
    TokenAmount,
    Trade,
    TradeType,
    WETH
} from '@sushiswap/sdk'
import { useMemo } from 'react'
import { useV1FactoryContract } from '../hooks/useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useETHBalances, useTokenBalance } from '../state/wallet/hooks'

export function useV1ExchangeAddress(tokenAddress?: string): string | undefined {
    const contract = useV1FactoryContract()

    const inputs = useMemo(() => [tokenAddress], [tokenAddress])
    return useSingleCallResult(contract, 'getExchange', inputs)?.result?.[0]
}

export class MockV1Pair extends Pair {
    constructor(etherAmount: BigintIsh, tokenAmount: TokenAmount) {
        super(tokenAmount, new TokenAmount(WETH[tokenAmount.token.chainId], etherAmount))
    }
}

function useMockV1Pair(inputCurrency?: Currency): MockV1Pair | undefined {
    const token = inputCurrency instanceof Token ? inputCurrency : undefined

    const isWETH = Boolean(token && token.equals(WETH[token.chainId]))
    const v1PairAddress = useV1ExchangeAddress(isWETH ? undefined : token?.address)
    const tokenBalance = useTokenBalance(v1PairAddress, token)
    const ETHBalance = useETHBalances([v1PairAddress])[v1PairAddress ?? '']

    return useMemo(
        () =>
            token && tokenBalance && ETHBalance && inputCurrency
                ? new MockV1Pair(ETHBalance.raw, tokenBalance)
                : undefined,
        [ETHBalance, inputCurrency, token, tokenBalance]
    )
}