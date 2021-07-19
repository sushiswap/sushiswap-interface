import { AppState } from '../index'
import { useAppSelector } from '../hooks'
import { ChainId, CurrencyAmount, Token } from '@sushiswap/sdk'
import { InaryStrategy } from './reducer'
import { tryParseAmount } from '../../functions'
import { useActiveWeb3React, useZenkoContract } from '../../hooks'
import { useTokenBalances } from '../wallet/hooks'
import { AXSUSHI, CREAM, CRXSUSHI, SUSHI, XSUSHI } from '../../constants'
import { t } from '@lingui/macro'
import useSWR from 'swr'
import { request } from 'graphql-request'
import { useEffect, useState } from 'react'

const fetcher = (query) => request('https://api.thegraph.com/subgraphs/name/matthewlilley/bar', query)

export function useInariState(): AppState['inari'] {
  return useAppSelector((state) => state.inari)
}

export const useInariStrategies = () => {
  const { account } = useActiveWeb3React()
  const { zapInValue, zapIn } = useInariState()
  const balances = useTokenBalances(account, [SUSHI[ChainId.MAINNET], XSUSHI, CRXSUSHI, AXSUSHI])
  const zenkoContract = useZenkoContract()
  const { data } = useSWR(`{bar(id: "0x8798249c2e607446efb7ad49ec89dd1865ff4272") {ratio, totalSupply}}`, fetcher)
  const xSushiPerSushi = parseFloat(data?.bar?.ratio)
  const [strategies, setStrategies] = useState({})

  useEffect(() => {
    if (!balances || !zenkoContract || !xSushiPerSushi) return

    const main = async () => {
      return {
        '0': {
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
          outputBalance: balances[XSUSHI.address]?.toSignificant(6),
          outputValue: zapIn ? +zapInValue / xSushiPerSushi : +zapInValue * xSushiPerSushi,
        },
        '1': {
          name: 'SUSHI → Cream',
          steps: ['SUSHI', 'xSUSHI', 'Cream'],
          zapMethod: 'stakeSushiToCream',
          unzapMethod: 'unstakeSushiFromCream',
          description: t`TODO`,
          inputToken: SUSHI[ChainId.MAINNET],
          inputBalance: balances[SUSHI[ChainId.MAINNET].address],
          outputToken: XSUSHI,
          outputSymbol: 'xSUSHI in Cream',
          outputBalance: await (async () => {
            return (
              await (zapIn
                ? zenkoContract.toCtoken(CRXSUSHI.address, balances[CRXSUSHI.address]?.toExact())
                : zenkoContract.fromCtoken(CRXSUSHI.address, balances[CRXSUSHI.address]?.toExact()))
            )?.toSignificant(6)
          })(),
          outputValue: zapIn ? +zapInValue / xSushiPerSushi : +zapInValue * xSushiPerSushi,
        },
        '2': {
          name: 'Cream → Bento',
          steps: ['SUSHI', 'crSUSHI', 'BentoBox'],
          zapMethod: 'stakeSushiToCreamToBento',
          unzapMethod: 'unstakeSushiFromCreamFromBento',
          description: t`TODO`,
          inputToken: SUSHI[ChainId.MAINNET],
          inputBalance: balances[SUSHI[ChainId.MAINNET].address],
          outputToken: CREAM,
          outputSymbol: 'crSUSHI in BentoBox',
          outputBalance: await (async () => {
            return (
              await (zapIn
                ? zenkoContract.toCtoken(CRXSUSHI.address, balances[CRXSUSHI.address]?.toExact())
                : zenkoContract.fromCtoken(CRXSUSHI.address, balances[CRXSUSHI.address]?.toExact()))
            )?.toSignificant(6)
          })(),
        },
        '3': {
          name: 'SUSHI → Aave',
          steps: ['SUSHI', 'xSUSHI', 'Aave'],
          zapMethod: 'stakeSushiToAave',
          unzapMethod: 'unstakeSushiFromAave',
          description: t`TODO`,
          inputToken: SUSHI[ChainId.MAINNET],
          inputBalance: balances[SUSHI[ChainId.MAINNET].address],
          outputToken: XSUSHI,
          outputSymbol: 'xSUSHI in Aave',
          outputBalance: balances[AXSUSHI.address]?.toSignificant(6),
          outputValue: zapIn ? +zapInValue / xSushiPerSushi : +zapInValue * xSushiPerSushi,
        },
      }
    }

    main().then((strategies) => setStrategies(strategies))
  }, [balances, xSushiPerSushi, zapIn, zapInValue, zenkoContract])

  console.log(strategies)
  return strategies
}

export function useDerivedInariState(): {
  strategy: InaryStrategy
  strategies: { [x: string]: InaryStrategy }
  zapInValue: CurrencyAmount<Token>
} {
  const { strategy, zapInValue } = useInariState()
  const strategies = useInariStrategies()

  return {
    strategy: strategies[strategy],
    strategies,
    zapInValue: strategies[strategy] ? tryParseAmount(zapInValue, strategies[strategy].inputToken) : null,
  }
}
