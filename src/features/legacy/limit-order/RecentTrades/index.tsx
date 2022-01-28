import { ArrowSmRightIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId } from '@sushiswap/core-sdk'
import { computePairAddress, Currency, FACTORY_ADDRESS, WNATIVE } from '@sushiswap/core-sdk'
import ExternalLink from 'app/components/ExternalLink'
import Loader from 'app/components/Loader'
import Typography from 'app/components/Typography'
import { classNames, currencyFormatter, decimalFormatter, getExplorerLink } from 'app/functions'
import { useSwaps, useSwapsObservable } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, useEffect, useMemo, useReducer, useState } from 'react'

import TradeFeed from './TradeFeed'

interface SwapRow {
  swap: any
  chainId?: ChainId
  divideQuote: boolean
  invertRate: boolean
}

const SwapRow: FC<SwapRow> = ({ chainId, swap, divideQuote, invertRate }) => {
  const amount0 = swap.amount0In === '0' ? swap.amount0Out : swap.amount0In
  const amount1 = swap.amount1In === '0' ? swap.amount1Out : swap.amount1In
  const div = divideQuote ? amount1 : amount0
  const invertedDiv = div === amount1 ? amount0 : amount1
  const price = Number(swap.amountUSD) / Number(invertRate ? invertedDiv : div)
  const value = Math.max(Math.min(((Number(swap.amountUSD) * Number(div)) / 1000000) * 25, 25), 0.1)

  return (
    <ExternalLink
      className={classNames(
        'relative font-mono grid grid-cols-12 px-3 items-center hover:bg-dark-850 gap-4',
        swap.amount1In === '0' ? 'animate-blink-down' : 'animate-blink-up'
      )}
      href={getExplorerLink(chainId, swap.transaction.id, 'transaction')}
    >
      <div
        className={classNames(swap.amount1In === '0' ? 'bg-down/50' : 'bg-up/50', 'absolute h-4')}
        style={{ width: `${value}%` }}
      />
      <Typography variant="xs" className="text-right col-span-4 tracking-tight">
        {decimalFormatter.format(amount0)}
      </Typography>
      <Typography
        variant="xs"
        className={classNames(
          'font-mono flex items-center justify-end text-right col-span-5 tracking-tight',
          swap.amount1In === '0' ? 'text-down' : 'text-up'
        )}
      >
        {currencyFormatter.format(price)}
        <ArrowSmRightIcon
          className={classNames('w-[14px] h-[14]px', swap.amount1In === '0' ? 'rotate-45' : '-rotate-45')}
        />
      </Typography>
      <Typography variant="xs" className="font-mono text-right text-secondary col-span-3 tracking-tight">
        {new Date(swap.transaction.timestamp * 1000).toLocaleTimeString()}
      </Typography>
    </ExternalLink>
  )
}

// @ts-ignore
// @ts-ignore

interface RecentTrades {
  token0?: Currency
  token1?: Currency
}

const MAX_LENGTH = 200

const RecentTrades: FC<RecentTrades> = ({ token0, token1 }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const [invert, setInvert] = useState(false)
  const [, forceUpdate] = useReducer((x) => x + 1, 0)
  const tradeFeed = useMemo(() => new TradeFeed(forceUpdate, MAX_LENGTH), [])

  const quoteIsStableCoin = token1?.symbol
    ? ['USDT', 'USDC', 'MIM', 'DAI', 'BUSD', 'UST', 'FRAX'].includes(token1.symbol)
    : false
  const quoteIsWrapped = WNATIVE[chainId || 1].address === token1?.wrapped.address

  const pair = useMemo(() => {
    const address =
      token0 &&
      token1 &&
      computePairAddress({
        factoryAddress: FACTORY_ADDRESS[chainId || 1],
        tokenA: token0.wrapped,
        tokenB: token1.wrapped,
      })
    return address?.toLowerCase()
  }, [chainId, token0, token1])

  const { data } = useSwaps({
    chainId,
    variables: {
      first: MAX_LENGTH,
      skip: 0,
      orderBy: 'timestamp',
      orderDirection: 'desc',
      where: { pair },
    },
    shouldFetch: !!pair,
    swrConfig: {
      refreshInterval: 20000,
    },
  })

  // Fetch initial history
  useEffect(() => {
    if (!data) return
    tradeFeed.ids = data.map((el: any) => el.id)
    tradeFeed.trades = data
  }, [data, tradeFeed])

  // Get live data
  useSwapsObservable({
    chainId,
    observer: tradeFeed.getObserver(),
    shouldFetch: !!chainId && !!pair,
    variables: {
      where: { pair },
    },
  })

  if (tradeFeed.trades.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    )
  }

  let quoteSymbol = !quoteIsStableCoin && !quoteIsWrapped ? token1?.symbol : token0?.symbol
  if (invert) quoteSymbol = quoteSymbol === token1?.symbol ? token0?.symbol : token1?.symbol

  return (
    <div className="flex flex-col h-full">
      <div className="grid items-center grid-cols-12 pt-3 pb-1 mx-3 gap-4">
        <Typography variant="xs" className="text-right text-secondary col-span-4">
          {i18n._(t`Trade Size`)}
        </Typography>
        <Typography
          variant="xs"
          className="text-right text-secondary col-span-5"
          onClick={() => setInvert((prev) => !prev)}
        >
          Price (
          <Typography variant="xxs" component="span">
            {quoteSymbol}
          </Typography>
          )
        </Typography>
        <Typography variant="xs" className="text-right text-secondary col-span-3">
          Time
        </Typography>
      </div>
      <div className="h-full overflow-auto">
        {tradeFeed.trades.map((el: any) => {
          return (
            <SwapRow
              chainId={chainId}
              swap={el}
              key={el.id}
              divideQuote={!quoteIsStableCoin && !quoteIsWrapped}
              invertRate={invert}
            />
          )
        })}
      </div>
    </div>
  )
}

export default RecentTrades
