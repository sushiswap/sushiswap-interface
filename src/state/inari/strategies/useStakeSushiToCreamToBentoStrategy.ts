import { CRXSUSHI, SUSHI } from '../../../constants'
import { ChainId, SUSHI_ADDRESS, Token } from '@sushiswap/sdk'
import { StrategyGeneralInfo, StrategyHook, StrategyTokenDefinitions } from '../types'
import { e10, tryParseAmount } from '../../../functions'
import { useActiveWeb3React, useZenkoContract } from '../../../hooks'
import { useCallback, useEffect, useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { I18n } from '@lingui/core'
import { t } from '@lingui/macro'
import useBaseStrategy from './useBaseStrategy'
import { useBentoBalance } from '../../bentobox/hooks'
import useBentoBoxTrait from '../traits/useBentoBoxTrait'
import { useLingui } from '@lingui/react'
import useSushiPerXSushi from '../../../hooks/useXSushiPerSushi'
import { useTokenBalances } from '../../wallet/hooks'

export const GENERAL = (i18n: I18n): StrategyGeneralInfo => ({
  name: i18n._(t`Cream → Bento`),
  steps: [i18n._(t`SUSHI`), i18n._(t`crXSUSHI`), i18n._(t`BentoBox`)],
  zapMethod: 'stakeSushiToCreamToBento',
  unzapMethod: 'unstakeSushiFromCreamFromBento',
  description: i18n._(t`Stake SUSHI for xSUSHI into Cream and deposit crXSUSHI into BentoBox in one click.`),
  inputSymbol: i18n._(t`SUSHI`),
  outputSymbol: i18n._(t`crXSUSHI in BentoBox`),
})

export const tokenDefinitions: StrategyTokenDefinitions = {
  inputToken: {
    chainId: ChainId.MAINNET,
    address: SUSHI_ADDRESS[ChainId.MAINNET],
    decimals: 18,
    symbol: 'SUSHI',
  },
  outputToken: {
    chainId: ChainId.MAINNET,
    address: '0x228619cca194fbe3ebeb2f835ec1ea5080dafbb2',
    decimals: 8,
    symbol: 'crXSUSHI',
  },
}

const useStakeSushiToCreamToBentoStrategy = (): StrategyHook => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const zenkoContract = useZenkoContract()
  const balances = useTokenBalances(account, [SUSHI[ChainId.MAINNET]])
  const sushiPerXSushi = useSushiPerXSushi(true)
  const crxSushiBentoBalance = useBentoBalance(CRXSUSHI.address)

  // Strategy ends in BentoBox so use BaseBentoBox strategy
  const general = useMemo(() => GENERAL(i18n), [i18n])
  const baseStrategy = useBaseStrategy({
    id: 'stakeSushiToCreamToBentoStrategy',
    general,
    tokenDefinitions,
  })

  // Add in BentoBox trait as output is in BentoBox
  const { setBalances, calculateOutputFromInput: _, ...strategy } = useBentoBoxTrait(baseStrategy)

  useEffect(() => {
    if (!balances) return

    setBalances({
      inputTokenBalance: balances[SUSHI[ChainId.MAINNET].address],
      outputTokenBalance: tryParseAmount(crxSushiBentoBalance?.value?.toFixed(8) || '0', CRXSUSHI),
    })
  }, [balances, setBalances, crxSushiBentoBalance?.value])

  const calculateOutputFromInput = useCallback(
    async (zapIn: boolean, inputValue: string, inputToken: Token, outputToken: Token) => {
      if (!sushiPerXSushi || !inputValue || !zenkoContract) return null

      if (zapIn) {
        const value = inputValue.toBigNumber(18).mulDiv(e10(18), sushiPerXSushi.toString().toBigNumber(18)).toString()
        const cValue = await zenkoContract.toCtoken(CRXSUSHI.address, value)
        return cValue.toFixed(outputToken.decimals)
      } else {
        const cValue = await zenkoContract.fromCtoken(CRXSUSHI.address, inputValue.toBigNumber(inputToken.decimals))
        const value = BigNumber.from(cValue).mulDiv(sushiPerXSushi.toString().toBigNumber(18), e10(18))
        return value.toFixed(outputToken.decimals)
      }
    },
    [sushiPerXSushi, zenkoContract]
  )

  return useMemo(
    () => ({
      ...strategy,
      setBalances,
      calculateOutputFromInput,
    }),
    [strategy, calculateOutputFromInput, setBalances]
  )
}

export default useStakeSushiToCreamToBentoStrategy
