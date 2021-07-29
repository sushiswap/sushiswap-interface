import { useAppSelector } from '../hooks'
import { Token } from '@sushiswap/sdk'
import { tryParseAmount } from '../../functions'
import useStakeSushiToBentoStrategy from './strategies/useStakeSushiToBentoStrategy'
import { DerivedInariState, InariState } from './types'
import useStakeSushiToCreamStrategy from './strategies/useStakeSushiToCreamStrategy'
import useStakeSushiToCreamToBentoStrategy from './strategies/useStakeSushiToCreamToBentoStrategy'
import useStakeSushiToAaveStrategy from './strategies/useStakeSushiToAaveStrategy'

export function useInariState(): InariState {
  return useAppSelector((state) => state.inari)
}

// Redux doesn't allow for non-serializable classes so use a derived state hook
// Derived state may not use any of the strategy hooks
export function useDerivedInariState(): DerivedInariState {
  const { id, zapIn, inputValue, outputValue, tokens, general } = useInariState()

  const inputToken = new Token(
    tokens.inputToken.chainId,
    tokens.inputToken.address,
    tokens.inputToken.decimals,
    tokens.inputToken.symbol
  )

  const outputToken = new Token(
    tokens.outputToken.chainId,
    tokens.outputToken.address,
    tokens.outputToken.decimals,
    tokens.outputToken.symbol
  )

  return {
    zapIn,
    inputValue: tryParseAmount(inputValue, inputToken),
    outputValue: tryParseAmount(outputValue, outputToken),
    id,
    general,
    tokens: {
      inputToken,
      outputToken,
    },
  }
}

export function useSelectedInariStrategy() {
  const { id: selectedStrategy } = useInariState()
  const strategies = useInariStrategies2()
  return strategies[selectedStrategy]
}

export function useInariStrategies2() {
  const stakeSushiToBentoStrategy = useStakeSushiToBentoStrategy()
  const stakeSushiToCreamStrategy = useStakeSushiToCreamStrategy()
  const stakeSushiToCreamToBentoStrategy = useStakeSushiToCreamToBentoStrategy()
  const stakeSushiToAaveStrategy = useStakeSushiToAaveStrategy()

  return {
    [stakeSushiToBentoStrategy.id]: stakeSushiToBentoStrategy,
    [stakeSushiToCreamStrategy.id]: stakeSushiToCreamStrategy,
    [stakeSushiToCreamToBentoStrategy.id]: stakeSushiToCreamToBentoStrategy,
    [stakeSushiToAaveStrategy.id]: stakeSushiToAaveStrategy,
  }
}
