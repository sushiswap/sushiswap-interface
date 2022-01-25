import { useEffect, useRef } from 'react'

import { widget } from '../../public/static/charting_library'

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)')
  const results = regex.exec(window.location.search)
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

function TestChart({
  symbol = 'AAPL',
  interval = 'D',
  containerId = 'tv_chart_container',
  datafeedUrl = 'https://demo_feed.tradingview.com',
  libraryPath = '/static/charting_library/',
  chartsStorageUrl = 'https://saveload.tradingview.com',
  chartsStorageApiVersion = '1.1',
  clientId = 'tradingview.com',
  userId = 'public_user_id',
  fullscreen = false,
  autosize = true,
  studiesOverrides = {},
}) {
  const ref = useRef()

  useEffect(() => {
    const widgetOptions = {
      symbol: symbol,
      // BEWARE: no trailing slash is expected in feed URL
      // @ts-ignore
      //   datafeed: new window.Datafeeds.UDFCompatibleDatafeed(props.datafeedUrl),
      datafeed: {
        // @ts-ignore
        onReady: (callback) => {
          alert('[onReady]: Method call')
          setTimeout(
            () =>
              callback({
                supported_resolutions: ['1', '3', '5', '15', '30', '60', '120', '240', 'D'],
              }),
            0
          )
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

          //   const data = getDexCandles(ChainId.AVALANCHE, {})
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
      },
      interval: interval,
      container_id: containerId,
      library_path: libraryPath,
      locale: getLanguageFromURL() || 'en',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      charts_storage_url: chartsStorageUrl,
      charts_storage_api_version: chartsStorageApiVersion,
      client_id: clientId,
      user_id: userId,
      fullscreen: fullscreen,
      autosize: autosize,
      studies_overrides: studiesOverrides,
    }

    // @ts-ignore
    const tvWidget = new widget(widgetOptions)
    console.log({ tvWidget })
    // @ts-ignore
    ref.current = tvWidget

    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {
        const button = tvWidget.createButton()
        button.setAttribute('title', 'Click to show a notification popup')
        button.classList.add('apply-common-tooltip')
        button.addEventListener('click', () =>
          tvWidget.showNoticeDialog({
            title: 'Notification',
            body: 'TradingView Charting Library API works correctly',
            callback: () => {
              console.log('Noticed!')
            },
          })
        )

        button.innerHTML = 'Check API'
      })
    })
  }, [ref])

  return (
    <div id="tv_chart_container" className="w-full h-full">
      Test 
    </div>
  )
}

export default TestChart
