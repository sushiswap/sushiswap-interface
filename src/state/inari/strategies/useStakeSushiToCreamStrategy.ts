import { t } from '@lingui/macro'
import { CRXSUSHI, SUSHI, XSUSHI } from '../../../constants'
import { ChainId, CurrencyAmount, SUSHI_ADDRESS, Token } from '@sushiswap/sdk'
import { tryParseAmount } from '../../../functions'
import { useActiveWeb3React, useZenkoContract } from '../../../hooks'
import { useTokenBalances } from '../../wallet/hooks'
import { StrategyGeneralInfo, StrategyHook, StrategyTokenDefinitions } from '../types'
import useBaseInariStrategy from './useBaseInariStrategy'
import { useCallback, useEffect } from 'react'
import { useDerivedInariState } from '../hooks'

export const general: StrategyGeneralInfo = {
  name: 'SUSHI → Cream',
  steps: ['SUSHI', 'xSUSHI', 'Cream'],
  zapMethod: 'stakeSushiToCream',
  unzapMethod: 'unstakeSushiFromCream',
  description: t`TODO`,
  inputSymbol: 'SUSHI',
  outputSymbol: 'xSUSHI in Cream',
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

const useStakeSushiToBentoStrategy = (): StrategyHook => {
  const { account } = useActiveWeb3React()
  const { zapIn } = useDerivedInariState()
  const zenkoContract = useZenkoContract()
  const balances = useTokenBalances(account, [SUSHI[ChainId.MAINNET], CRXSUSHI])
  const { execute, setBalances, ...baseStrategy } = useBaseInariStrategy({
    id: 'stakeSushiToCreamStrategy',
    general,
    tokenDefinitions,
  })

  useEffect(() => {
    if (!zenkoContract || !balances) return

    const main = async () => {
      if (!balances[CRXSUSHI.address]) return tryParseAmount('0', XSUSHI)
      const bal = await zenkoContract.fromCtoken(
        CRXSUSHI.address,
        balances[CRXSUSHI.address].toFixed().toBigNumber(CRXSUSHI.decimals).toString()
      )
      setBalances({
        inputTokenBalance: balances[SUSHI[ChainId.MAINNET].address],
        outputTokenBalance: CurrencyAmount.fromRawAmount(XSUSHI, bal.toString()),
      })
    }

    main()
  }, [balances, setBalances, zenkoContract])

  // Run before executing transaction creation by transforming from xSUSHI value to crXSUSHI value
  // As you will be spending crXSUSHI when unzapping from this strategy
  const preExecute = useCallback(
    async (val: CurrencyAmount<Token>) => {
      if (zapIn) return execute(val)

      const bal = await zenkoContract.toCtoken(CRXSUSHI.address, val.toExact().toBigNumber(XSUSHI.decimals))
      return execute(CurrencyAmount.fromRawAmount(CRXSUSHI, bal.toString()))
    },
    [execute, zapIn, zenkoContract]
  )

  return {
    ...baseStrategy,
    setBalances,
    execute: preExecute,
  }
}

export default useStakeSushiToBentoStrategy
