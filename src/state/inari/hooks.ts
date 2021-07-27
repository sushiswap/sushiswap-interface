import { useAppSelector } from '../hooks'
import { ChainId, CurrencyAmount, Token } from '@sushiswap/sdk'
import { InariState, InaryStrategy } from './reducer'
import { e10, tryParseAmount } from '../../functions'
import { useActiveWeb3React, useZenkoContract } from '../../hooks'
import { useTokenBalances } from '../wallet/hooks'
import { AXSUSHI, CREAM, CRXSUSHI, SUSHI, XSUSHI } from '../../constants'
import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import useSushiPerXSushi from '../../hooks/useXSushiPerSushi'

export function useInariState(): InariState {
  return useAppSelector((state) => state.inari)
}

export const useInariStrategies = () => {
  const { account } = useActiveWeb3React()
  const { zapInValue, zapIn } = useInariState()
  const balances = useTokenBalances(account, [SUSHI[ChainId.MAINNET], XSUSHI, CRXSUSHI, AXSUSHI])
  const zenkoContract = useZenkoContract()
  const sushiPerXSushi = useSushiPerXSushi()
  const [strategies, setStrategies] = useState<InaryStrategy[]>([])

  useEffect(() => {
    if (!balances || !zenkoContract || !sushiPerXSushi) return
    const val = zapInValue || '0'
    const outputValue = (
      zapIn
        ? val.toBigNumber(18).mulDiv(e10(18), sushiPerXSushi.toString().toBigNumber(18))
        : val.toBigNumber(18).mulDiv(sushiPerXSushi.toString().toBigNumber(18), e10(18))
    )?.toFixed(18)

    const main = async () => {
      return [
        {
          name: 'SUSHI → Bento',
          steps: ['SUSHI', 'xSUSHI', 'BentoBox'],
          zapMethod: 'stakeSushiToBento',
          unzapMethod: 'unstakeSushiFromBento',
          description: t`Stake SUSHI for xSUSHI and deposit into BentoBox in one click. xSUSHI in BentoBox is automatically
                invested into a passive yield strategy, and can be lent or used as collateral for borrowing in Kashi.`,
          inputToken: SUSHI[ChainId.MAINNET],
          inputBalance: balances[SUSHI[ChainId.MAINNET].address],
          outputToken: XSUSHI,
          outputSymbol: 'xSUSHI in BentoBox',
          outputBalance: balances[XSUSHI.address],
          outputValue,
        },
        {
          name: 'SUSHI → Cream',
          steps: ['SUSHI', 'xSUSHI', 'Cream'],
          zapMethod: 'stakeSushiToCream',
          unzapMethod: 'unstakeSushiFromCream',
          description: t`TODO`,
          inputToken: SUSHI[ChainId.MAINNET],
          inputBalance: balances[SUSHI[ChainId.MAINNET].address],
          outputToken: XSUSHI,
          outputSymbol: 'xSUSHI in Cream',
          // outputBalance: await (async () => {
          //   const toRet = await (zapIn
          //     ? zenkoContract.toCtoken(CRXSUSHI.address, balances[CRXSUSHI.address]?.toExact())
          //     : zenkoContract.fromCtoken(CRXSUSHI.address, balances[CRXSUSHI.address]?.toExact()))
          //
          //   return tryParseAmount(CRXSUSHI.address, toRet)
          // })(),
          outputBalance: balances[XSUSHI.address],
          outputValue,
        },
        {
          name: 'Cream → Bento',
          steps: ['SUSHI', 'crSUSHI', 'BentoBox'],
          zapMethod: 'stakeSushiToCreamToBento',
          unzapMethod: 'unstakeSushiFromCreamFromBento',
          description: t`TODO`,
          inputToken: SUSHI[ChainId.MAINNET],
          inputBalance: balances[SUSHI[ChainId.MAINNET].address],
          outputToken: CREAM,
          outputSymbol: 'crSUSHI in BentoBox',
          // outputBalance: await (async () => {
          //   const toRet = await (zapIn
          //     ? zenkoContract.toCtoken(CRXSUSHI.address, balances[CRXSUSHI.address]?.toExact())
          //     : zenkoContract.fromCtoken(CRXSUSHI.address, balances[CRXSUSHI.address]?.toExact()))
          //
          //   return tryParseAmount(CRXSUSHI.address, toRet)
          // })(),
          outputBalance: balances[XSUSHI.address],
          outputValue,
        },
        {
          name: 'SUSHI → Aave',
          steps: ['SUSHI', 'xSUSHI', 'Aave'],
          zapMethod: 'stakeSushiToAave',
          unzapMethod: 'unstakeSushiFromAave',
          description: t`TODO`,
          inputToken: SUSHI[ChainId.MAINNET],
          inputBalance: balances[SUSHI[ChainId.MAINNET].address],
          outputToken: XSUSHI,
          outputSymbol: 'xSUSHI in Aave',
          outputBalance: balances[AXSUSHI.address],
          outputValue,
        },
      ] as InaryStrategy[]
    }

    main().then((strategies) => {
      console.log(strategies[0].outputBalance)
      setStrategies(strategies)
    })
  }, [balances, sushiPerXSushi, zapIn, zapInValue, zenkoContract])

  return strategies
}

export function useDerivedInariState() {
  const { strategy, zapInValue } = useInariState()
  const strategies = useInariStrategies()

  return {
    strategy: strategies[strategy],
    strategies,
    zapInValue: strategies[strategy] ? tryParseAmount(zapInValue, strategies[strategy].inputToken) : null,
  }
}
