import { useLingui } from '@lingui/react'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'

interface TradingViewChartProps {
  id: string
  outputSymbol?: string
  inputSymbol?: string
  onTwChartSymbol?: (symbol: string) => void
}

import { t } from '@lingui/macro'
import Widget from 'app/components/TradingViewComponent/index'
import useTradingViewEvent from 'app/components/TradingViewComponent/useTradingViewEvent'
import Typography from 'app/components/Typography'
import useDebounce from 'app/hooks/useDebounce'

import Loader from '../Loader'

const bnbToWBNBSymbol = (sym: string) => (sym === 'BNB' ? 'WBNB' : sym)

const SYMBOL_PREFIX = 'SUSHISWAP:'

const TradingViewChart: FC<TradingViewChartProps> = ({ id, outputSymbol, inputSymbol, onTwChartSymbol }) => {
  const { i18n } = useLingui()
  const [isLoading, setIsLoading] = useState(true)
  const [hasNoData, setHasNoData] = useState(false)

  const symbol = useMemo(() => {
    if (!(inputSymbol && outputSymbol)) {
      return undefined
    }

    const input = bnbToWBNBSymbol(inputSymbol)
    const output = bnbToWBNBSymbol(outputSymbol)
    return `${input}${output}`
  }, [inputSymbol, outputSymbol])

  const onNoDataEvent = useCallback(() => {
    console.debug('No data from TV widget')
    setHasNoData(true)
  }, [])

  const onLoadedEvent = useCallback(() => {
    setIsLoading(false)
  }, [])

  useTradingViewEvent({
    id,
    onNoDataEvent,
    onLoadedEvent,
  })

  // debounce the loading to wait for no data event from TV widget.
  // we cover the loading spinner over TV, let TV try to load data from pairs
  // if there's no no-data event coming between the debounce time, we assume the chart is loaded
  const debouncedLoading = useDebounce(isLoading, 800)

  useEffect(() => {
    if (!(isLoading || debouncedLoading) && !hasNoData && symbol) {
      onTwChartSymbol && onTwChartSymbol(symbol)
    } else {
      onTwChartSymbol && onTwChartSymbol('')
    }
  }, [debouncedLoading, hasNoData, isLoading, onTwChartSymbol, symbol])

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="h-full w-full">
        {hasNoData && (
          <div className="flex h-full justify-center items-center flex-col">
            <Typography variant="lg" weight={700} className="text-low-emphesis">
              {i18n._(t`TradingView chart not available`)}
            </Typography>
          </div>
        )}
        {(isLoading || debouncedLoading) && !hasNoData && <Loader />}
        {!hasNoData && !isLoading && (
          <div className="h-full">{symbol && <Widget id={id} symbol={`${inputSymbol}${outputSymbol}`} />}</div>
        )}
      </div>
    </div>
  )
}

export default React.memo(TradingViewChart)
