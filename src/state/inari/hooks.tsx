import { useAppSelector } from '../hooks'
import { Token } from '@sushiswap/sdk'
import { tryParseAmount } from '../../functions'
import useStakeSushiToBentoStrategy from './strategies/useStakeSushiToBentoStrategy'
import { DerivedInariState, InariState } from './types'
import useStakeSushiToCreamStrategy from './strategies/useStakeSushiToCreamStrategy'
import useStakeSushiToCreamToBentoStrategy from './strategies/useStakeSushiToCreamToBentoStrategy'
import useStakeSushiToAaveStrategy from './strategies/useStakeSushiToAaveStrategy'
import { useMemo } from 'react'

export function useInariState(): InariState {
  return useAppSelector((state) => state.inari)
}

// Redux doesn't allow for non-serializable classes so use a derived state hook for complex values
// Derived state may not use any of the strategy hooks to avoid an infinite loop
export function useDerivedInariState(): DerivedInariState {
  const { inputValue, outputValue, tokens, general, ...rest } = useInariState()

  // BalancePanel input token
  const inputToken = useMemo(
    () =>
      new Token(
        tokens.inputToken.chainId,
        tokens.inputToken.address,
        tokens.inputToken.decimals,
        tokens.inputToken.symbol
      ),
    [tokens.inputToken.address, tokens.inputToken.chainId, tokens.inputToken.decimals, tokens.inputToken.symbol]
  )

  // BalancePanel output token
  const outputToken = useMemo(
    () =>
      new Token(
        tokens.outputToken.chainId,
        tokens.outputToken.address,
        tokens.outputToken.decimals,
        tokens.outputToken.symbol
      ),
    [tokens.outputToken.address, tokens.outputToken.chainId, tokens.outputToken.decimals, tokens.outputToken.symbol]
  )

  // For some strategies we display xSushi instead of the token we spend when withdrawing from a strategy
  // If these two tokens have different symbols we have a problem with tryParseAmount.
  // Take the useStakeSushiToCreamStrategy for example xSushi has 18 decimals whereas crXSUSHI has 8.
  // You should be able to enter a value with 18 decimals (because we display in xSushi amount)
  // tryParseAmount would return undefined because it is trying to parse the inputValue to a CurrencyAmount
  // with crXSUSHI set as currency which has only 8 decimals.
  // spendToken can be set to the token that will be spent when withdrawing from a strategy (crXSUSHi in this example)
  const spendToken = useMemo(() => {
    if (!tokens.spendToken) return null
    new Token(
      tokens.spendToken.chainId,
      tokens.spendToken.address,
      tokens.spendToken.decimals,
      tokens.spendToken.symbol
    )
  }, [tokens.spendToken])

  return useMemo(
    () => ({
      ...rest,
      inputValue: tryParseAmount(inputValue, inputToken),
      outputValue: tryParseAmount(outputValue, outputToken),
      general,
      tokens: {
        inputToken,
        outputToken,
        spendToken,
      },
    }),
    [general, inputToken, inputValue, outputToken, outputValue, rest, spendToken]
  )
}

export function useSelectedInariStrategy() {
  const { id: selectedStrategy } = useInariState()
  const strategies = useInariStrategies()
  return useMemo(() => strategies[selectedStrategy], [selectedStrategy, strategies])
}

// Use this hook to register all strategies
export function useInariStrategies() {
  const stakeSushiToBentoStrategy = useStakeSushiToBentoStrategy()
  const stakeSushiToCreamStrategy = useStakeSushiToCreamStrategy()
  const stakeSushiToCreamToBentoStrategy = useStakeSushiToCreamToBentoStrategy()
  const stakeSushiToAaveStrategy = useStakeSushiToAaveStrategy()

  return useMemo(
    () => ({
      [stakeSushiToBentoStrategy.id]: stakeSushiToBentoStrategy,
      [stakeSushiToCreamStrategy.id]: stakeSushiToCreamStrategy,
      [stakeSushiToCreamToBentoStrategy.id]: stakeSushiToCreamToBentoStrategy,
      [stakeSushiToAaveStrategy.id]: stakeSushiToAaveStrategy,
    }),
    [stakeSushiToAaveStrategy, stakeSushiToBentoStrategy, stakeSushiToCreamStrategy, stakeSushiToCreamToBentoStrategy]
  )
}
