import { SUSHI, USDC } from '../constants'
import { ChainId, WETH9 } from '@sushiswap/sdk'
import { useCallback, useMemo } from 'react'
import isEqual from 'lodash/isEqual'
import { tryParseAmount } from '../functions'
import { Pool } from '../features/trident/types'
import { PoolType } from '../features/trident/types'

export const toHref = (pool: Pool) => {
  return pool.tokens.map((el) => el.address).join('/')
}

type UsePoolsReturnType = [
  Pool[],
  {
    getPoolByAddresses: (addresses: string[]) => Pool
    toHref: (pool: Pool) => string
  }
]

const useTridentPools = (): UsePoolsReturnType => {
  const pools: Pool[] = useMemo(
    () => [
      {
        type: PoolType.CLASSIC,
        amounts: [tryParseAmount('1000', SUSHI[ChainId.MAINNET]), tryParseAmount('3.66', WETH9[ChainId.MAINNET])],
        tokens: [SUSHI[ChainId.MAINNET], WETH9[ChainId.MAINNET]],
        apy: '37.8%',
        tvl: '$1,534,443.08',
        fee: '0.3%',
      },
      {
        type: PoolType.HYBRID,
        amounts: [
          tryParseAmount('1232', SUSHI[ChainId.MAINNET]),
          tryParseAmount('4.26', WETH9[ChainId.MAINNET]),
          tryParseAmount('4.26', USDC),
        ],
        tokens: [SUSHI[ChainId.MAINNET], WETH9[ChainId.MAINNET], USDC],
        apy: '37.8%',
        tvl: '$1,534,443.08',
        fee: '0.3%',
      },
    ],
    []
  )

  const getPoolByAddresses = useCallback(
    (addresses: string[]) =>
      pools.find((pool) =>
        isEqual(
          pool.amounts.map((el) => el.currency.address),
          addresses
        )
      ),
    [pools]
  )

  return [pools, { getPoolByAddresses, toHref }]
}

type UsePoolReturnType = [
  Pool,
  {
    toHref: (pool: Pool) => string
  }
]

export const useTridentPool = (addresses: string | string[]): UsePoolReturnType => {
  if (addresses.length < 2) throw new Error('Invalid pool')

  const [, { getPoolByAddresses }] = useTridentPools()
  return [getPoolByAddresses(addresses as string[]), { toHref }]
}

export default useTridentPools
