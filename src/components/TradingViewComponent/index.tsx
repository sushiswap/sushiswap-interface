import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useRef } from 'react'

import { widget } from '../../../public/static/charting_library'
import DATAFEED from './datafeed'

console.log(DATAFEED)
/**
 * When the script tag is injected the TradingView object is not immediately
 * available on the window. So we listen for when it gets set
 */
const tradingViewListener = async () =>
  new Promise<void>((resolve) =>
    Object.defineProperty(window, 'TradingView', {
      configurable: true,
      set(value) {
        this.tv = value
        resolve(value)
      },
    })
  )

const initializeTradingView = (TradingViewObj: any, symbol: string, localeCode: string, opts: any) => {
  let timezone = 'Etc/UTC'
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch (e) {
    // noop
  }

  return new widget({
    // Advanced Chart Widget uses the legacy embedding scheme,
    // an id property should be specified in the settings object
    debug: true,
    id: opts.container_id,
    autosize: true,
    height: '100%',
    symbol,
    datafeed: DATAFEED,
    interval: '5',
    timezone,
    theme: 'dark',
    style: '1',
    locale: localeCode,
    toolbar_bg: '#f1f3f6',
    enable_publishing: false,
    allow_symbol_change: false,
    hide_side_toolbar: false,
    enabled_features: ['header_fullscreen_button'],
    overrides: {
      'mainSeriesProperties.showCountdown': true,
      'paneProperties.background': '#131722',
      'paneProperties.vertGridProperties.color': '#363c4e',
      'paneProperties.horzGridProperties.color': '#363c4e',
      'symbolWatermarkProperties.transparency': 90,
      'scalesProperties.textColor': '#AAA',
      'mainSeriesProperties.candleStyle.wickUpColor': '#336854',
      'mainSeriesProperties.candleStyle.wickDownColor': '#7f323f',
    },
    ...opts,
  })
}

interface TradingViewProps {
  id: string
  symbol: string
}

const Index: FC<TradingViewProps> = ({ id, symbol }) => {
  const { locale } = useRouter()
  const widgetRef = useRef<any>()
  const isDesktop = useDesktopMediaQuery()

  useEffect(() => {
    const opts: any = {
      container_id: id,
      symbol,
    }

    if (!isDesktop) {
      opts.hide_side_toolbar = true
    }

    // @ts-ignore
    if (window.tv) {
      // @ts-ignore
      widgetRef.current = initializeTradingView(window.tv, symbol, locale || 'en', opts)
    } else {
      tradingViewListener().then((tv) => {
        widgetRef.current = initializeTradingView(tv, symbol, locale || 'en', opts)
      })
    }

    // Ignore isMobile to avoid re-render TV
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, symbol, locale])

  return (
    <div className="overflow-hidden tradingview_container">
      <div id={id} />
    </div>
  )
}

export default Index
