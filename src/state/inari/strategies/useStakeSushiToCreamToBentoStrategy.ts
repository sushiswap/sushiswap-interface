import { t } from '@lingui/macro'
import { CRXSUSHI, SUSHI } from '../../../constants'
import { ChainId, SUSHI_ADDRESS, Token } from '@sushiswap/sdk'
import { e10, tryParseAmount } from '../../../functions'
import { useBentoBalance } from '../../bentobox/hooks'
import { useActiveWeb3React, useZenkoContract } from '../../../hooks'
import { useTokenBalances } from '../../wallet/hooks'
import { StrategyGeneralInfo, StrategyHook, StrategyTokenDefinitions } from '../types'
import useBaseInariStrategy from './useBaseInariStrategy'
import { useCallback, useEffect } from 'react'
import useSushiPerXSushi from '../../../hooks/useXSushiPerSushi'
import { BigNumber } from 'ethers'

export const general: StrategyGeneralInfo = {
  name: 'Cream → Bento',
  steps: ['SUSHI', 'crXSUSHI', 'BentoBox'],
  zapMethod: 'stakeSushiToCreamToBento',
  unzapMethod: 'unstakeSushiFromCreamFromBento',
  description: t`TODO`,
  inputSymbol: 'SUSHI',
  outputSymbol: 'crXSUSHI in BentoBox',
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
    address: '0x228619cca194fbe3ebeb2f835ec1ea5080dafbb2',
    decimals: 8,
    symbol: 'crXSUSHI',
  },
}

const useStakeSushiToCreamToBentoStrategy = (): StrategyHook => {
  const { account } = useActiveWeb3React()
  const zenkoContract = useZenkoContract()
  const balances = useTokenBalances(account, [SUSHI[ChainId.MAINNET]])
  const sushiPerXSushi = useSushiPerXSushi(true)
  const crxSushiBentoBalance = useBentoBalance(CRXSUSHI.address)
  const {
    setBalances,
    calculateOutputFromInput: _,
    ...baseStrategy
  } = useBaseInariStrategy({
    id: 'stakeSushiToCreamToBentoStrategy',
    general,
    tokenDefinitions,
    usesBentoBox: true,
  })

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

  // Run before executing transaction creation by transforming from xSUSHI value to crXSUSHI value
  // As you will be spending crXSUSHI when unzapping from this strategy
  // const preExecute = useCallback(
  //   async (val: CurrencyAmount<Token>) => {
  //     if (zapIn) return execute(val)
  //
  //     const bal = await zenkoContract.toCtoken(CRXSUSHI.address, val.toExact().toBigNumber(XSUSHI.decimals))
  //     return execute(CurrencyAmount.fromRawAmount(CRXSUSHI, bal.toString()))
  //   },
  //   [execute, zapIn, zenkoContract]
  // )

  return {
    ...baseStrategy,
    setBalances,
    calculateOutputFromInput,
    // execute: preExecute,
  }
}

export default useStakeSushiToCreamToBentoStrategy
