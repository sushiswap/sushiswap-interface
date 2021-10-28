import { ChainId, SUSHI_ADDRESS } from '@sushiswap/core-sdk'
import { SUSHI, XSUSHI } from '../../../config/tokens'
import { StrategyGeneralInfo, StrategyHook, StrategyTokenDefinitions } from '../types'
import { useEffect, useMemo } from 'react'

import { I18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { tryParseAmount } from '../../../functions'
import { useActiveWeb3React } from '../../../hooks'
import useBaseStrategy from './useBaseStrategy'
import { useBentoBalance } from '../../bentobox/hooks'
import useBentoBoxTrait from '../traits/useBentoBoxTrait'
import { useLingui } from '@lingui/react'
import { useTokenBalances } from '../../wallet/hooks'

export const GENERAL = (i18n: I18n): StrategyGeneralInfo => ({
  name: i18n._(t`SUSHI → Bento`),
  steps: [i18n._(t`SUSHI`), i18n._(t`xSUSHI`), i18n._(t`BentoBox`)],
  zapMethod: 'stakeSushiToBento',
  unzapMethod: 'unstakeSushiFromBento',
  description:
    i18n._(t`Stake SUSHI for xSUSHI and deposit into BentoBox in one click. xSUSHI in BentoBox is automatically
                invested into a passive yield strategy, and can be lent or used as collateral for borrowing in Kashi.`),
  inputSymbol: i18n._(t`SUSHI`),
  outputSymbol: i18n._(t`xSUSHI in BentoBox`),
})

export const tokenDefinitions: StrategyTokenDefinitions = {
  inputToken: {
    chainId: ChainId.ETHEREUM,
    address: SUSHI_ADDRESS[ChainId.ETHEREUM],
    decimals: 18,
    symbol: 'SUSHI',
  },
  outputToken: {
    chainId: ChainId.ETHEREUM,
    address: '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272',
    decimals: 18,
    symbol: 'XSUSHI',
  },
}

const useStakeSushiToBentoStrategy = (): StrategyHook => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const balances = useTokenBalances(account, [SUSHI[ChainId.ETHEREUM], XSUSHI])
  const xSushiBentoBalance = useBentoBalance(XSUSHI.address)

  // Strategy ends in BentoBox so use BaseBentoBox strategy
  const general = useMemo(() => GENERAL(i18n), [i18n])
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
      inputTokenBalance: balances[SUSHI[ChainId.ETHEREUM].address],
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
