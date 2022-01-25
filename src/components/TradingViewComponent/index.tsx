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
type DynamicTradingViewOptions = Pick<TradingViewChartOptions, 'container' | 'symbol'>
type GetDefaultWidgetOptions = (opts: DynamicTradingViewOptions) => TradingViewChartOptions

const getDefaultWidgetOptions: GetDefaultWidgetOptions = (opts) => {
  let timezone: Timezone = 'Etc/UTC'
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone
  } catch (e) {
    // noop
  }

  return {
    ...opts,
    ...(timezone && { timezone }),
    datafeed: DATAFEED,
    locale: 'en',
    debug: false,
    autosize: true,
    interval: '5' as ResolutionString,
    theme: 'dark' as ThemeName,
    style: '1',
    toolbar_bg: '#f1f3f6',
    enable_publishing: false,
    allow_symbol_change: false,
    hide_side_toolbar: false,
    library_path: '/static/charting_library/',
    enabled_features: ['header_fullscreen_button'],
    overrides: {
      'mainSeriesProperties.showCountdown': true,
      'paneProperties.background.solid': true,
      'paneProperties.background': '#0D0415',
      'paneProperties.vertGridProperties.color': '#161522',
      'paneProperties.horzGridProperties.color': '#161522',
      'symbolWatermarkProperties.transparency': 90,
      'scalesProperties.textColor': '#AAA',
    },
  }
}

interface TradingViewProps {
  id: string
  symbol: string
}

const Widget: FC<TradingViewProps> = ({ id, symbol }) => {
  const ref = useRef<any>()

  useEffect(() => {
    const widgetOptions: DynamicTradingViewOptions = {
      container: id,
      symbol,
    }

    const tvWidget = new widget(getDefaultWidgetOptions(widgetOptions))
    ref.current = tvWidget

    tvWidget.onChartReady(() => {
      tvWidget.addCustomCSSFile('./theme/dark.css')
    })
  }, [id, ref, symbol])

  return <div id={id} className="absolute inset-0" />
}

export default Widget
