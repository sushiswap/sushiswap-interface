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