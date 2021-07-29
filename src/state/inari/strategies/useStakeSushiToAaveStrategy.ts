import { t } from '@lingui/macro'
import { AXSUSHI, SUSHI } from '../../../constants'
import { ChainId, SUSHI_ADDRESS } from '@sushiswap/sdk'
import { useActiveWeb3React } from '../../../hooks'
import { useTokenBalances } from '../../wallet/hooks'
import { StrategyGeneralInfo, StrategyHook, StrategyTokenDefinitions } from '../types'
import useBaseInariStrategy from './useBaseInariStrategy'
import { useEffect } from 'react'

export const general: StrategyGeneralInfo = {
  name: 'SUSHI → Aave',
  steps: ['SUSHI', 'xSUSHI', 'Aave'],
  zapMethod: 'stakeSushiToAave',
  unzapMethod: 'unstakeSushiFromAave',
  description: t`TODO`,
  inputSymbol: 'SUSHI',
  outputSymbol: 'xSUSHI in Aave',
}

export const tokenDefinitions: StrategyTokenDefinitions = {
  inputToken: {
    chainId: ChainId.MAINNET,
    address: SUSHI_ADDRESS[ChainId.MAINNET],
    decimals: 18,
    symbol: 'SUSHI',
  },
  outputToken: {
    chainId: ChainId.MAINNET,
    address: '0xf256cc7847e919fac9b808cc216cac87ccf2f47a',
    decimals: 18,
    symbol: 'aXSUSHI',
  },
}

const useStakeSushiToBentoStrategy = (): StrategyHook => {
  const { account } = useActiveWeb3React()
  const balances = useTokenBalances(account, [SUSHI[ChainId.MAINNET], AXSUSHI])
  const { setBalances, ...baseStrategy } = useBaseInariStrategy({
    id: 'stakeSushiToAaveStrategy',
    general,
    tokenDefinitions,
  })

  useEffect(() => {
    if (!balances) return

    setBalances({
      inputTokenBalance: balances[SUSHI[ChainId.MAINNET].address],
      outputTokenBalance: balances[AXSUSHI.address],
    })
  }, [balances, setBalances])

  return {
    ...baseStrategy,
    setBalances,
  }
}

export default useStakeSushiToBentoStrategy
