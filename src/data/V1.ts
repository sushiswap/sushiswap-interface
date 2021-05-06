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
import { Version } from '../hooks/useToggledVersion'
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

/**
 * Returns the trade to execute on V1 to go between input and output token
 */
export function useV1Trade(
    isExactIn?: boolean,
    inputCurrency?: Currency,
    outputCurrency?: Currency,
    exactAmount?: CurrencyAmount
): Trade | undefined {
    // get the mock v1 pairs
    const inputPair = useMockV1Pair(inputCurrency)
    const outputPair = useMockV1Pair(outputCurrency)

    const inputIsETH = inputCurrency === ETHER
    const outputIsETH = outputCurrency === ETHER

    // construct a direct or through ETH v1 route
    let pairs: Pair[] = []
    if (inputIsETH && outputPair) {
        pairs = [outputPair]
    } else if (outputIsETH && inputPair) {
        pairs = [inputPair]
    }
    // if neither are ETH, it's token-to-token (if they both exist)
    else if (inputPair && outputPair) {
        pairs = [inputPair, outputPair]
    }

    const route = inputCurrency && pairs && pairs.length > 0 && new Route(pairs, inputCurrency, outputCurrency)
    let v1Trade: Trade | undefined
    try {
        v1Trade =
            route && exactAmount
                ? new Trade(route, exactAmount, isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT)
                : undefined
    } catch (error) {
        console.debug('Failed to create V1 trade', error)
    }
    return v1Trade
}

export function getTradeVersion(trade?: Trade): Version | undefined {
    const isV1 = trade?.route?.pairs?.some(pair => pair instanceof MockV1Pair)
    if (isV1) return Version.v1
    if (isV1 === false) return Version.v2
    return undefined
}