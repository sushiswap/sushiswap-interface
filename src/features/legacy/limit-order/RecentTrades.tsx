import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import { currencyFormatter, decimalFormatter } from 'app/functions'
import { useSwaps } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import React, { CSSProperties, FC, useCallback } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'

interface SwapRow {
  swap: any
  style: CSSProperties
}

const SwapRow: FC<SwapRow> = ({ swap, style }) => {
  const amount0 = swap.amount0In === '0' ? swap.amount1In : swap.amount0In
  const amount1 = swap.amount1Out === '0' ? swap.amount0Out : swap.amount1Out
  const price = Number(amount0) / Number(amount1)

  return (
    <div style={style} className="grid grid-cols-3 px-3">
      <Typography variant="xs" className="text-white text-right">
        {decimalFormatter.format(amount0 || amount1)}
      </Typography>
      <Typography variant="xs" className="text-white text-right">
        {currencyFormatter.format(price)}
      </Typography>
      <Typography variant="xs" className="text-white text-right">
        {decimalFormatter.format(swap.amount0)}
      </Typography>
    </div>
  )
}

interface RecentTrades {
  quoteCurrency?: Currency
}

const RecentTrades: FC<RecentTrades> = ({ quoteCurrency }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const { data: swaps } = useSwaps({
    chainId,
    variables: { first: 1000, skip: 0, orderBy: 'timestamp', orderDirection: 'desc' },
    shouldFetch: !!chainId,
    swrConfig: { refreshInterval: 10000, fallbackData: [] },
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
      <div className="grid grid-cols-3 border-b border-dark-700 px-3 py-2">
        <Typography variant="xs" className="text-right">
          {i18n._(t`Trade Size`)}
        </Typography>
        <Typography variant="xs" className="text-right">
          Price ({quoteCurrency?.symbol})
        </Typography>
        <Typography variant="xs" className="text-right">
          Time
        </Typography>
      </div>
      <div className="h-full py-2">
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
