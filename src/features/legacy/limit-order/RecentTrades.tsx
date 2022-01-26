import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { computePairAddress, Currency, FACTORY_ADDRESS } from '@sushiswap/core-sdk'
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
  const price = Number(amount0) / Number(amount1)

  return (
    <div
      style={style}
      className={classNames(
        'grid grid-cols-3 px-3 border-l items-center',
        swap.amount0In === '0' ? 'border-l-red' : 'border-l-green'
      )}
    >
      <Typography variant="xs" className="text-right text-white">
        {decimalFormatter.format(amount0)}
      </Typography>
      <Typography
        variant="xs"
        className={classNames('text-right relative pr-4', swap.amount0In === '0' ? 'text-red' : 'text-green')}
      >
        {decimalFormatter.format(amount1)}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={classNames('w-4 h-4 absolute right-0 top-0', swap.amount0In === '0' ? 'rotate-45' : '-rotate-45')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>

        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          className={classNames('w-5 h-5', swap.amount0In === '0' ? 'rotate-45' : '-rotate-45')}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg> */}
      </Typography>
      <Typography variant="xs" className="text-right text-white">
        {format(Number(swap.transaction.timestamp * 1000), 'p')}
      </Typography>
    </div>
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
    //   @ts-ignore
    const address = computePairAddress({ factoryAddress: FACTORY_ADDRESS[chainId], tokenA: token0, tokenB: token1 })
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
      <div className="grid grid-cols-3 mx-3 pt-3 pb-1 items-center">
        <Typography variant="xs" className="text-right">
          {i18n._(t`Trade Size`)}
        </Typography>
        <Typography variant="xs" className="text-right">
          Price ({token1?.symbol})
        </Typography>
        <Typography variant="xs" className="text-right">
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
