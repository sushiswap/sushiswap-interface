import React, { FC } from 'react'

interface TradingViewChartProps {
  outputSymbol?: string
  inputSymbol?: string
  onTwChartSymbol?: (symbol: string) => void
}

import TradingViewComponent from '.'

const bnbToWBNBSymbol = (sym: string) => (sym === 'BNB' ? 'WBNB' : sym)

const ID = 'TV_SWAP_CHART'
const SYMBOL_PREFIX = 'SUSHISWAP:'

const TradingViewChart: FC<TradingViewChartProps> = ({ outputSymbol, inputSymbol, onTwChartSymbol }) => {
  // const { i18n } = useLingui()
  // const [isLoading, setIsLoading] = useState(true)
  // const [hasNoData, setHasNoData] = useState(false)
  //
  // const symbol = useMemo(() => {
  //   if (!(inputSymbol && outputSymbol)) {
  //     return undefined
  //   }
  //
  //   const input = bnbToWBNBSymbol(inputSymbol)
  //   const output = bnbToWBNBSymbol(outputSymbol)
  //   return `${input}${output}`
  // }, [inputSymbol, outputSymbol])
  //
  // const onNoDataEvent = useCallback(() => {
  //   console.debug('No data from TV widget')
  //   setHasNoData(true)
  // }, [])
  //
  // const onLoadedEvent = useCallback(() => {
  //   setIsLoading(false)
  // }, [])
  //
  // useTradingViewEvent({
  //   id: ID,
  //   onNoDataEvent,
  //   onLoadedEvent,
  // })
  //
  // // debounce the loading to wait for no data event from TV widget.
  // // we cover the loading spinner over TV, let TV try to load data from pairs
  // // if there's no no-data event coming between the debounce time, we assume the chart is loaded
  // const debouncedLoading = useDebounce(isLoading, 800)
  //
  // useEffect(() => {
  //   if (!(isLoading || debouncedLoading) && !hasNoData && symbol) {
  //     onTwChartSymbol && onTwChartSymbol(symbol)
  //   } else {
  //     onTwChartSymbol && onTwChartSymbol('')
  //   }
  // }, [debouncedLoading, hasNoData, isLoading, onTwChartSymbol, symbol])

  return (
    <div className="flex flex-1 overflow-hidden">
      {/*<div className="h-full w-full">*/}
      {/*  {hasNoData && (*/}
      {/*    <div className="flex h-full justify-center items-center flex-col">*/}
      {/*      <Typography variant="lg" weight={700} className="text-low-emphesis">*/}
      {/*        {i18n._(t`TradingView chart not available`)}*/}
      {/*      </Typography>*/}
      {/*    </div>*/}
      {/*  )}*/}
      {/*  {(isLoading || debouncedLoading) && !hasNoData && <Loader />}*/}
      {/*{!hasNoData && <div className="h-full">{symbol && <TradingViewComponent id={ID} symbol={`TEST`} />}</div>}*/}
      {/*</div>*/}
      <TradingViewComponent id={ID} symbol={`TEST`} />
    </div>
  )
}

export default React.memo(TradingViewChart)
