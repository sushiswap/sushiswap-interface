import { ChainId } from '@sushiswap/core-sdk'
import { getDexCandles } from 'app/services/graph/fetchers/dexcandles'

const history = {}
const supportedResolutions = ['1', '3', '5', '15', '30', '60', '120', '240', 'D']

const config = {
  supported_resolutions: supportedResolutions,
}

export default {
  // @ts-ignore
  onReady: (callback) => {
    alert('[onReady]: Method call')
    setTimeout(() => callback(config), 0)
  },
  // @ts-ignore
  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    console.log('[searchSymbols]: Method call')
  },
  // @ts-ignore
  resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
    console.log('[resolveSymbol]: Method call', symbolName)
  },
  // @ts-ignore
  getBars: async (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
    alert('hi')

    const data = getDexCandles(ChainId.AVALANCHE, {})
    return []
  },
  // @ts-ignore
  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
    console.log('[subscribeBars]: Method call with subscribeUID:', subscribeUID)
  },
  // @ts-ignore
  unsubscribeBars: (subscriberUID) => {
    console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID)
  },
}
