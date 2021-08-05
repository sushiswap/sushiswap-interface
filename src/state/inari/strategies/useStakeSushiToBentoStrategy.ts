import { t } from '@lingui/macro'
import { SUSHI, XSUSHI } from '../../../constants'
import { ChainId, SUSHI_ADDRESS } from '@sushiswap/sdk'
import { tryParseAmount } from '../../../functions'
import { useBentoBalance } from '../../bentobox/hooks'
import { useActiveWeb3React } from '../../../hooks'
import { useTokenBalances } from '../../wallet/hooks'
import { StrategyGeneralInfo, StrategyHook, StrategyTokenDefinitions } from '../types'
import { useEffect, useMemo } from 'react'
import useBaseStrategy from './useBaseStrategy'
import useBentoBoxTrait from '../traits/useBentoBoxTrait'

export const general: StrategyGeneralInfo = {
  name: 'SUSHI → Bento',
  steps: ['SUSHI', 'xSUSHI', 'BentoBox'],
  zapMethod: 'stakeSushiToBento',
  unzapMethod: 'unstakeSushiFromBento',
  description: t`Stake SUSHI for xSUSHI and deposit into BentoBox in one click. xSUSHI in BentoBox is automatically
                invested into a passive yield strategy, and can be lent or used as collateral for borrowing in Kashi.`,
  inputSymbol: 'SUSHI',
  outputSymbol: 'xSUSHI in BentoBox',
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
    address: '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272',
    decimals: 18,
    symbol: 'XSUSHI',
  },
}

const useStakeSushiToBentoStrategy = (): StrategyHook => {
  const { account } = useActiveWeb3React()
  const balances = useTokenBalances(account, [SUSHI[ChainId.MAINNET], XSUSHI])
  const xSushiBentoBalance = useBentoBalance(XSUSHI.address)

  // Strategy ends in BentoBox so use BaseBentoBox strategy
  const baseStrategy = useBaseStrategy({
    id: 'stakeSushiToBentoStrategy',
    general,
    tokenDefinitions,
  })

  // Add in BentoBox trait as output is in BentoBox
  const { setBalances, ...strategy } = useBentoBoxTrait(baseStrategy)

  useEffect(() => {
    if (!balances) return

    setBalances({
      inputTokenBalance: balances[SUSHI[ChainId.MAINNET].address],
      outputTokenBalance: tryParseAmount(xSushiBentoBalance?.value?.toFixed(18) || '0', XSUSHI),
    })
  }, [balances, setBalances, xSushiBentoBalance?.value])

  return useMemo(
    () => ({
      setBalances,
      ...strategy,
    }),
    [strategy, setBalances]
  )
}

export default useStakeSushiToBentoStrategy
