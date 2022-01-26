import { ChainId, JSBI } from '@sushiswap/core-sdk'
import { client, getDexCandles } from 'app/services/graph/fetchers/dexcandles'
import { barsSubscriptionQuery } from 'app/services/graph/observables/exchange'
import { SubscriptionClient } from 'subscriptions-transport-ws'

import {
  DatafeedConfiguration,
  IBasicDataFeed,
  LibrarySymbolInfo,
  ResolutionString,
} from '../../../../public/static/charting_library'

const history = {}
const supported_resolutions = ['5', '15', '60', '240', 'D'] as ResolutionString[]

const config: DatafeedConfiguration = {
  supported_resolutions,
}

let _client: SubscriptionClient

type DataFeed = (chainId: ChainId) => IBasicDataFeed
const dataFeed: DataFeed = (chainId) => ({
  onReady: (callback) => {
    if (chainId) {
      _client = client(chainId)
      _client.onConnected(() => {
        setTimeout(() => callback(config), 0)
      })
    }
  },
  searchSymbols: () => {},
  resolveSymbol: (symbolName, onSymbolResolvedCallback) => {
    const split_data = symbolName.split(/[:]/)
    const symbol_stub: LibrarySymbolInfo = {
      full_name: symbolName,
      listed_exchange: split_data[0],
      format: 'price',
      name: symbolName,
      description: split_data[1],
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      ticker: symbolName,
      exchange: split_data[0],
      minmov: 1,
      pricescale: 100000000,
      has_intraday: true,
      intraday_multipliers: ['1', '5', '15', '60', '240'],
      supported_resolutions,
      volume_precision: 8,
      data_status: 'streaming',
    }

    setTimeout(function () {
      onSymbolResolvedCallback(symbol_stub)
      console.log('Resolving that symbol....', symbol_stub)
    }, 0)
  },
  getBars: async (symbolInfo, resolutionString, periodParams, onResult) => {
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
    let resolution = 300
    if (resolutionString === '5') resolution = 300
    if (resolutionString === '15') resolution = 900
    if (resolutionString === '60') resolution = 3600
    if (resolutionString === '240') resolution = 14400
    if (resolutionString === '1D') resolution = 86400

    const [, , chainId, token0, token1] = symbolInfo.full_name.split(/[:]/)

    let bars = []
    try {
      const data = await getDexCandles(Number(chainId) as ChainId, {
        where: { period: resolution, token0, token1, time_gt: periodParams.from, time_lt: periodParams.to },
      })

      bars = data.map(({ open, low, high, close, time, token1TotalAmount }: any) => {
        return {
          open: !stableQuote ? open : Number(1 / open),
          low: !stableQuote ? low : Number(1 / low),
          high: !stableQuote ? high : Number(1 / high),
          close: !stableQuote ? close : Number(1 / close),
          time: time * 1000,
          volume: Number(
            JSBI.divide(JSBI.BigInt(token1TotalAmount), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))).toString()
          ),
        }
      })

      const lastBar = bars[bars.length - 1]
      // @ts-ignore
      history[symbolInfo.name] = { lastBar: lastBar }
    } catch (e) {
      //
    }

    if (bars.length) {
      onResult(bars, { noData: false })
    } else {
      onResult(bars, { noData: true })
    }
  },
  subscribeBars: (symbolInfo, resolutionString, onTick) => {
    // Format resolution for subgraph
    let resolution = 300
    if (resolutionString === '5') resolution = 300
    if (resolutionString === '15') resolution = 900
    if (resolutionString === '60') resolution = 3600
    if (resolutionString === '240') resolution = 14400
    if (resolutionString === '1D') resolution = 86400

    const [, , , token0, token1] = symbolInfo.full_name.split(/[:]/)

    const observable = _client.request({
      query: barsSubscriptionQuery,
      variables: {
        // @ts-ignore
        where: { period: resolution, token0, token1 },
      },
    })

    observable.subscribe({
      next(results) {
        if (!results?.data?.candles?.[0]) return

        // @ts-ignore
        const { open, low, high, close, time, token1TotalAmount } = results?.data?.candles[0]

        const bar = {
          open: Number(1 / open),
          low: Number(1 / low),
          high: Number(1 / high),
          close: Number(1 / close),
          time: time * 1000,
          volume: Number(
            JSBI.divide(JSBI.BigInt(token1TotalAmount), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))).toString()
          ),
        }

        // @ts-ignore
        history[symbolInfo.name] = { lastBar: bar }

        onTick(bar)
      },
      error(error) {
        console.log('error', error)
      },
      complete() {
        console.log('complete')
      },
    })
  },
  unsubscribeBars: () => {
    _client.unsubscribeAll()
  },
})

export default dataFeed
