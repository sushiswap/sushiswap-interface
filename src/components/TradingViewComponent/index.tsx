import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, useEffect, useMemo, useRef, useState } from 'react'

import { ResolutionString, ThemeName, Timezone, widget } from '../../../public/static/charting_library'
import Loader from '../Loader'
import DATAFEED from './api'

interface TradingViewProps {
  id: string
  symbol: string
}

const Widget: FC<TradingViewProps> = ({ id, symbol }) => {
  const { chainId } = useActiveWeb3React()
  const ref = useRef<any>()
  const datafeed = useMemo(() => (chainId ? DATAFEED(chainId) : undefined), [chainId])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!datafeed) return

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
      datafeed,
      locale: 'en',
      debug: false,
      autosize: true,
      interval: '5' as ResolutionString,
      theme: 'dark' as ThemeName,
      charts_storage_api_version: '1.1',
      library_path: '/static/charting_library/',
      disabled_features: [
        'header_symbol_search',
        'header_interval_dialog_button',
        'show_interval_dialog_on_key_press',
        'symbol_search_hot_key',
        'study_dialog_search_control',
        'header_compare',
        'edit_buttons_in_legend',
        'symbol_info',
        'border_around_the_chart',
        'star_some_intervals_by_default',
        'datasource_copypaste',
        'right_bar_stays_on_scroll',
        'go_to_date',
        'compare_symbol',
        'header_screenshot',
        'remove_library_container_border',
        'use_localstorage_for_settings',
      ],
      enabled_features: [
        'dont_show_boolean_study_arguments',
        'remove_library_container_border',
        'save_chart_properties_to_local_storage',
        'side_toolbar_in_fullscreen_mode',
        'hide_last_na_study_output',
        'constraint_dialogs_movement',
        'hide_left_toolbar_by_default',
      ],
      overrides: {
        'mainSeriesProperties.showCountdown': true,
        'paneProperties.backgroundType': 'solid',
        'paneProperties.background': '#161522',
        'paneProperties.vertGridProperties.color': '#1d1e2c',
        'paneProperties.horzGridProperties.color': '#1d1e2c',
        'symbolWatermarkProperties.transparency': 90,
        'scalesProperties.textColor': '#AAA',
      },
      studies_overrides: {
        'volume.volume.transparency': 75,
      },
    })

    ref.current = tvWidget

    tvWidget.onChartReady(() => {
      tvWidget.addCustomCSSFile('./theme/dark.css')
      tvWidget.headerReady().then(() => {
        setLoading(false)
      })
    })
  }, [chainId, datafeed, id, ref, symbol])

  return (
    <div className="relative w-full h-full">
      <div id={id} className="w-full h-full" />
      {loading && (
        <div className="absolute inset-0 bg-dark-900 z-10">
          <div className="w-full h-full flex justify-center items-center">
            <Loader />
          </div>
        </div>
      )}
    </div>
  )
}

export default Widget
