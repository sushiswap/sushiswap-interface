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

// Redux doesn't allow for non-serializable classes so use a derived state hook
// Derived state may not use any of the strategy hooks
export function useDerivedInariState(): DerivedInariState {
  const { id, zapIn, inputValue, outputValue, tokens, general } = useInariState()

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

  return useMemo(
    () => ({
      zapIn,
      inputValue: tryParseAmount(inputValue, inputToken),
      outputValue: tryParseAmount(outputValue, outputToken),
      id,
      general,
      tokens: {
        inputToken,
        outputToken,
      },
    }),
    [general, id, inputToken, inputValue, outputToken, outputValue, zapIn]
  )
}

export function useSelectedInariStrategy() {
  const { id: selectedStrategy } = useInariState()
  const strategies = useInariStrategies()
  return useMemo(() => strategies[selectedStrategy], [selectedStrategy, strategies])
}

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
