import React, { FC, useEffect, useRef } from 'react'

import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
  ThemeName,
  Timezone,
  TradingTerminalWidgetOptions,
  widget,
} from '../../../public/static/charting_library'
import DATAFEED from './api'

type TradingViewChartOptions = ChartingLibraryWidgetOptions | TradingTerminalWidgetOptions

interface TradingViewProps {
  id: string
  symbol: string
}

const Widget: FC<TradingViewProps> = ({ id, symbol }) => {
  const ref = useRef<any>()

  useEffect(() => {
    let timezone: Timezone = 'Etc/UTC'
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone
    } catch (e) {
      // noop
    }

    const tvWidget = new widget({
      ...(timezone && { timezone }),
      symbol,
      container: id,
      datafeed: DATAFEED,
      locale: 'en',
      debug: false,
      autosize: true,
      interval: '5' as ResolutionString,
      theme: 'dark' as ThemeName,
      library_path: '/static/charting_library/',
      enabled_features: ['header_fullscreen_button', 'hide_left_toolbar_by_default'],
      overrides: {
        'mainSeriesProperties.showCountdown': true,
        'paneProperties.background.solid': true,
        'paneProperties.background': '#0D0415',
        'paneProperties.vertGridProperties.color': '#161522',
        'paneProperties.horzGridProperties.color': '#161522',
        'symbolWatermarkProperties.transparency': 90,
        'scalesProperties.textColor': '#AAA',
        'mainSeriesProperties.candleStyle.upColor': '#1DFA00',
        'mainSeriesProperties.candleStyle.downColor': '#FF0000',
      },
    })

    ref.current = tvWidget

    tvWidget.onChartReady(() => {
      tvWidget.addCustomCSSFile('./theme/dark.css')
    })
  }, [id, ref, symbol])

  return <div id={id} className="w-full h-full" />
}

export default Widget
