import { AppState } from '../index'
import { useAppSelector } from '../hooks'
import { CurrencyAmount, Token } from '@sushiswap/sdk'
import { INARI_STRATEGIES } from './constants'
import { InaryStrategy } from './reducer'
import { tryParseAmount } from '../../functions'

export function useInariState(): AppState['inari'] {
  return useAppSelector((state) => state.inari)
}

export function useDerivedInariState(): {
  strategy: InaryStrategy
  zapInValue: CurrencyAmount<Token>
} {
  const { strategy, zapInValue } = useInariState()

  return {
    strategy: INARI_STRATEGIES[strategy],
    zapInValue: tryParseAmount(zapInValue, INARI_STRATEGIES[strategy].inputToken),
  }
}
