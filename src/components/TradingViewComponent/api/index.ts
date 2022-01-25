import { ChainId, JSBI } from '@sushiswap/core-sdk'
import { getDexCandles } from 'app/services/graph/fetchers/dexcandles'

import {
  DatafeedConfiguration,
  IBasicDataFeed,
  LibrarySymbolInfo,
  ResolutionString,
} from '../../../../public/static/charting_library'

const history = {}
const supported_resolutions = ['5', '15', '60', '240', 'D', 'W'] as ResolutionString[]

const config: DatafeedConfiguration = {
  supported_resolutions,
}

const dataFeed: IBasicDataFeed = {
  onReady: (callback) => {
    console.log('=====onReady running')
    setTimeout(() => callback(config), 0)
  },
  searchSymbols: () => {
    console.log('======Search Symbols running')
  },
  resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
    console.log('======resolveSymbol running')

    const split_data = symbolName.split(/[:]/)
    const symbol_stub: LibrarySymbolInfo = {
      full_name: symbolName,
      listed_exchange: split_data[0],
      format: 'price', // what's this?
      name: split_data[1],
      description: split_data[1],
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      ticker: split_data[1],
      exchange: split_data[0],
      minmov: 1,
      pricescale: 100000000,
      has_intraday: true,
      intraday_multipliers: ['1', '60'],
      supported_resolutions,
      volume_precision: 8,
      data_status: 'streaming',
    }

    setTimeout(function () {
      onSymbolResolvedCallback(symbol_stub)
      console.log('Resolving that symbol....', symbol_stub)
    }, 0)
  },
  getBars: async (symbolInfo, resolutionString, periodParams, onResult, onError) => {
    console.log('=====getBars running')

    let stableQuote = false
    if (
      symbolInfo.full_name
        .split(':')[1]
        .split('/')[1]
        .match(/USDT|USDC|MIM|DAI|BUSD|UST|FRAX/)
    ) {
      stableQuote = true
    }

    // Format resolution for subgraph
    let resolution: string = resolutionString
    if (resolution === '1D') resolution = '1440'
    if (resolution === '1W') resolution = '10080'

    const [, , chainId, token0, token1] = symbolInfo.full_name.split(/[:]/)

    let bars = []
    if (periodParams.firstDataRequest) {
      try {
        const data = await getDexCandles(Number(chainId) as ChainId, {
          where: { period: 300, token0, token1, time_gt: periodParams.from, time_lt: periodParams.to },
        })

        bars = data.map(({ open, low, high, close, time, token1TotalAmount }) => {
          return {
            open: !stableQuote ? open : Number(1 / open),
            low: !stableQuote ? low : Number(1 / low),
            high: !stableQuote ? high : Number(1 / high),
            close: !stableQuote ? close : Number(1 / close),
            time: time * 1000,
            volume: Number(
              JSBI.divide(
                JSBI.BigInt(token1TotalAmount),
                JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))
              ).toString()
            ),
          }
        })
      } catch (e) {
        //
      }
    }

    if (bars.length) {
      onResult(bars, { noData: false })
    } else {
      onResult(bars, { noData: true })
    }
  },
  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
    console.log('=====subscribeBars runnning')
  },
  unsubscribeBars: (subscriberUID) => {
    console.log('=====unsubscribeBars running')
  },
}

export default dataFeed
