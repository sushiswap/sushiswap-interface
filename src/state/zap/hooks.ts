import { Currency, CurrencyAmount, ETHER, JSBI, Pair, Percent, Price, TokenAmount } from '@sushiswap/sdk'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PairState, usePair } from '../../data/Reserves'
import { useTotalSupply } from '../../data/TotalSupply'

import { useActiveWeb3React } from '../../hooks'
import { wrappedCurrency, wrappedCurrencyAmount } from '../../utils/wrappedCurrency'
import { AppDispatch, AppState } from '../index'
import { tryParseAmount } from '../swap/hooks'
import { useCurrencyBalances } from '../wallet/hooks'
import { Field, typeInput } from './actions'

const ZERO = JSBI.BigInt(0)

export function useZapState(): AppState['zap'] {
  return useSelector<AppState, AppState['zap']>(state => state.zap);
}

export function useZapActionHandlers(
  noLiquidity: boolean | undefined
): {
  onFieldInput: (typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onFieldInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY, typedValue, noLiquidity: noLiquidity === true }))
    },
    [dispatch, noLiquidity]
  )

  return {
    onFieldInput,
  }
}

export function useDerivedZapInfo(
  currency: Currency | undefined,
  pool: Pair | undefined,
): {
  // dependentField: Field
  currency:  Currency | undefined
  // pair?: Pair | null
  // pairState: PairState
  currencyBalance: CurrencyAmount | undefined
  parsedAmount: CurrencyAmount | undefined
  // price?: Price
  noLiquidity?: boolean
  estimatedOutputValue: CurrencyAmount | undefined
  // liquidityMinted?: TokenAmount
  // poolTokenPercentage?: Percent
  // error?: string
} {
  const { account, chainId } = useActiveWeb3React()

  const { typedValue } = useZapState()

  // token
  const currencyData = useMemo(
    () => currency ?? undefined,
    [currency]
  )

  // pair
  const [pairState, pair] = usePair(currency, currency)
  const totalSupply = useTotalSupply(pair?.liquidityToken)

  const noLiquidity: boolean =
    pairState === PairState.NOT_EXISTS || Boolean(totalSupply && JSBI.equal(totalSupply.raw, ZERO))

  // balance
  const balances = useCurrencyBalances(account ?? undefined, [
    currency
  ])
  const currencyBalance = balances[0]

  const parsedAmount = tryParseAmount(typedValue, currency);

  const estimatedOutputValue = tryParseAmount((+typedValue * 0.2).toString(), currency)

  // // liquidity minted
  // const liquidityMinted = useMemo(() => {
  //   const { [Field.CURRENCY]: currencyAAmount, [Field.CURRENCY]: currencyBAmount } = parsedAmounts
  //   const [tokenAmountA, tokenAmountB] = [
  //     wrappedCurrencyAmount(currencyAAmount, chainId),
  //     wrappedCurrencyAmount(currencyBAmount, chainId)
  //   ]
  //   if (pair && totalSupply && tokenAmountA && tokenAmountB) {
  //     return pair.getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB)
  //   } else {
  //     return undefined
  //   }
  // }, [chainId, pair, totalSupply])

  // const poolTokenPercentage = useMemo(() => {
  //   if (liquidityMinted && totalSupply) {
  //     return new Percent(liquidityMinted.raw, totalSupply.add(liquidityMinted).raw)
  //   } else {
  //     return undefined
  //   }
  // }, [liquidityMinted, totalSupply])

  return {
    currency: currencyData,
    currencyBalance,
    noLiquidity,
    parsedAmount,
    estimatedOutputValue,
  }
}