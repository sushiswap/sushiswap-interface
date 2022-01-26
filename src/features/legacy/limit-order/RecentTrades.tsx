import { ArrowSmRightIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, computePairAddress, Currency, FACTORY_ADDRESS } from '@sushiswap/core-sdk'
import ExternalLink from 'app/components/ExternalLink'
import Typography from 'app/components/Typography'
import { classNames, currencyFormatter, decimalFormatter, getExplorerLink } from 'app/functions'
import { useSwaps, useSwapsObservable } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, useEffect, useMemo, useState } from 'react'
// @ts-ignore
// @ts-ignore

interface SwapRow {
  swap: any
  chainId?: ChainId
  quoteIsStableCoin: boolean
}

const SwapRow: FC<SwapRow> = ({ chainId, swap, quoteIsStableCoin }) => {
  const amount0 = swap.amount0In === '0' ? swap.amount0Out : swap.amount0In
  const amount1 = swap.amount1In === '0' ? swap.amount1Out : swap.amount1In
  const price = quoteIsStableCoin ? Number(amount1) / Number(amount0) : Number(amount0) / Number(amount1)
  const value = Math.min(((Number(amount0) * Number(price)) / 1000000) * 25, 25)

  return (
    <ExternalLink
      className={classNames(
        'relative font-mono grid grid-cols-12 px-3 items-center hover:bg-dark-850 gap-2',
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

interface RecentTrades {
  token0?: Currency
  token1?: Currency
}

const RecentTrades: FC<RecentTrades> = ({ token0, token1 }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const [buffer, setBuffer] = useState({
    items: new Array(200),
    ids: new Array(200),
  })

  const quoteIsStableCoin = token1?.symbol
    ? ['USDT', 'USDC', 'MIM', 'DAI', 'BUSD', 'UST', 'FRAX'].includes(token1.symbol)
    : false

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
      first: 200,
      skip: 0,
      orderBy: 'timestamp',
      orderDirection: 'desc',
      where: { pair },
    },
    shouldFetch: !!pair,
  })

  // Fetch initial history
  useEffect(() => {
    if (!data) return

    setBuffer({
      items: data,
      ids: data.map((el: any) => el.transaction.id),
    })
  }, [data])

  // Get live data
  useSwapsObservable({
    chainId,
    observer: {
      next({ data }) {
        if (data.swaps && data.swaps.length > 0) {
          setBuffer((prevState) => {
            if (prevState.ids.includes(data.swaps[0].transaction.id)) return prevState

            // Copy state
            const state = { ...prevState }

            // remove last element
            state.items.pop()
            state.ids.pop()

            // add first element
            state.items.unshift(data.swaps[0])
            state.ids.unshift(data.swaps[0].transaction.id)

            return state
          })
        }
      },
      error(error) {
        console.log(`Stream error: ${error.message}`)
      },
      complete() {
        console.log('Stream ended')
      },
    },
    shouldFetch: !!chainId && !!pair,
    variables: {
      where: { pair },
    },
  })

  return (
    <div className="flex flex-col h-full">
      <div className="grid items-center grid-cols-12 pt-3 pb-1 mx-3 gap-2">
        <Typography variant="xs" className="text-right text-secondary col-span-4">
          {i18n._(t`Trade Size`)}
        </Typography>
        <Typography variant="xs" className="text-right text-secondary col-span-5">
          Price ({token1?.symbol})
        </Typography>
        <Typography variant="xs" className="text-right text-secondary col-span-3">
          Time
        </Typography>
      </div>
      <div className="h-full overflow-auto">
        {buffer.items.map((el) => {
          return <SwapRow chainId={chainId} swap={el} key={el.transaction.id} quoteIsStableCoin={quoteIsStableCoin} />
        })}
      </div>
    </div>
  )
}

export default RecentTrades
