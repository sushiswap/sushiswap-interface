import { ChainId, Currency, Token, WETH9 } from '@sushiswap/sdk'
import { useCallback, useMemo } from 'react'
import isEqual from 'lodash/isEqual'
import { tryParseAmount } from '../functions'
import { Pool, PoolType } from '../features/trident/types'
import { useRouter } from 'next/router'
import { SUSHI, USDC } from '../config/tokens'

export const toHref = (type: string, currencies: Record<string, Currency>) => {
  const addresses = Object.keys(currencies)
  return `${type}/${addresses.join('/')}`
}

type UsePoolsReturnType = [
  Pool[],
  {
    getPoolByAddresses: (addresses: string[], type: PoolType) => Pool
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
        apy: '37.8',
        tvl: '$1,534,443.08',
        fee: '0.3%',
        isFarm: true,
      },
      {
        type: PoolType.CONCENTRATED,
        amounts: [tryParseAmount('1000', SUSHI[ChainId.MAINNET]), tryParseAmount('3.66', WETH9[ChainId.MAINNET])],
        tokens: [SUSHI[ChainId.MAINNET], WETH9[ChainId.MAINNET]],
        apy: '84.5',
        tvl: '$1,534,443.08',
        fee: '0.3%',
        isFarm: false,
      },
      {
        type: PoolType.WEIGHTED,
        amounts: [tryParseAmount('1000', SUSHI[ChainId.MAINNET]), tryParseAmount('3.66', WETH9[ChainId.MAINNET])],
        tokens: [SUSHI[ChainId.MAINNET], WETH9[ChainId.MAINNET]],
        apy: '12.0',
        tvl: '$1,534,443.08',
        fee: '0.3%',
        isFarm: false,
      },
      {
        type: PoolType.HYBRID,
        amounts: [
          tryParseAmount('1232', SUSHI[ChainId.MAINNET]),
          tryParseAmount('4.26', WETH9[ChainId.MAINNET]),
          tryParseAmount('4.26', USDC),
        ],
        tokens: [SUSHI[ChainId.MAINNET], WETH9[ChainId.MAINNET], USDC],
        apy: '5.53',
        tvl: '$1,534,443.08',
        fee: '0.3%',
        isFarm: false,
      },
    ],
    []
  )

  const getPoolByAddresses = useCallback(
    (addresses: string[], type: string) =>
      pools.find(
        (pool) =>
          isEqual(
            pool.amounts.map((el) => el.currency.address),
            addresses
          ) && type === pool.type
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

export const useTridentPool = (addresses: string | string[], type: PoolType): UsePoolReturnType => {
  if (addresses.length < 2) throw new Error('Invalid pool')

  const [, { getPoolByAddresses }] = useTridentPools()
  return [getPoolByAddresses(addresses as string[], type), { toHref }]
}

export interface WithTridentPool {
  pool: Pool
  tokens: Record<string, Token>
}

export const withTridentPool = (poolType: PoolType) => (Component) => {
  return ({ children }) => {
    const { query } = useRouter()
    const [pool] = useTridentPool(query.tokens, poolType)
    const tokens = useMemo(() => pool.tokens.reduce((acc, cur) => ((acc[cur.address] = cur), acc), {}), [pool?.tokens])

    return (
      <Component pool={pool} tokens={tokens}>
        {children}
      </Component>
    )
  }
}
export default useTridentPools
