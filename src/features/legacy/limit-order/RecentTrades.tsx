import { ArrowSmRightIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { computePairAddress, Currency, FACTORY_ADDRESS } from '@sushiswap/core-sdk'
import ExternalLink from 'app/components/ExternalLink'
import Typography from 'app/components/Typography'
import { classNames, decimalFormatter } from 'app/functions'
import { useSwaps } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import { format } from 'date-fns'
import React, { CSSProperties, FC, useCallback, useMemo } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
interface SwapRow {
  swap: any
  style: CSSProperties
}

const SwapRow: FC<SwapRow> = ({ swap, style }) => {
  const amount0 = swap.amount0In === '0' ? swap.amount0Out : swap.amount0In
  const amount1 = swap.amount1In === '0' ? swap.amount1Out : swap.amount1In

  return (
    <ExternalLink
      style={style}
      className={classNames(
        'grid grid-cols-3 px-3 border-l items-center',
        swap.amount1In === '0' ? 'border-l-red/50' : 'border-l-green/50'
      )}
      href={`https://snowtrace.io/tx/${swap.transaction.id}`}
    >
      <Typography variant="xs" className="text-right text-white">
        {decimalFormatter.format(amount0)}
      </Typography>
      <Typography
        variant="xs"
        className={classNames(
          'flex items-center justify-end text-right gap-0.5',
          swap.amount1In === '0' ? 'text-red' : 'text-green'
        )}
      >
        {decimalFormatter.format(amount1)}
        <ArrowSmRightIcon
          className={classNames('w-[14px] h-[14]px', swap.amount1In === '0' ? 'rotate-45' : '-rotate-45')}
        />
      </Typography>
      <Typography variant="xs" className="text-right text-secondary">
        {format(Number(swap.transaction.timestamp * 1000), 'p')}
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
  const pair = useMemo(() => {
    const address = computePairAddress({
      //   @ts-ignore
      factoryAddress: FACTORY_ADDRESS[chainId],
      //   @ts-ignore
      tokenA: token0.wrapped,
      //   @ts-ignore
      tokenB: token1.wrapped,
    })
    return address.toLowerCase()
  }, [chainId, token0, token1])

  const { data: swaps } = useSwaps({
    chainId,
    variables: {
      first: 1000,
      skip: 0,
      orderBy: 'timestamp',
      orderDirection: 'desc',

      where: { pair },
    },
    shouldFetch: !!chainId,
    swrConfig: { refreshInterval: 2000, fallbackData: [] },
  })

  const Row = useCallback(
    ({ index, style }) => {
      const swap = swaps[index]
      return <SwapRow swap={swap} style={style} />
    },
    [swaps]
  )

  return (
    <div className="flex flex-col h-full">
      <div className="grid items-center grid-cols-3 pt-3 pb-1 mx-3">
        <Typography variant="xs" className="text-right text-secondary">
          {i18n._(t`Trade Size`)}
        </Typography>
        <Typography variant="xs" className="text-right text-secondary">
          Price ({token1?.symbol})
        </Typography>
        <Typography variant="xs" className="text-right text-secondary">
          Time
        </Typography>
      </div>
      <div className="h-full">
        <AutoSizer>
          {/*@ts-ignore TYPE NEEDS FIXING*/}
          {({ height, width }) => (
            <List height={height} width={width} itemCount={swaps.length} itemSize={24}>
              {Row}
            </List>
          )}
        </AutoSizer>
      </div>
    </div>
  )
}

export default RecentTrades
