import { useEffect } from 'react'

export enum TradingViewEvent {
  NoData = 'v-widget-no-data',
  Load = 'tv-widget-load',
}

type UseTradingViewEvent = ({
  id,
  onNoDataEvent,
  onLoadedEvent,
}: {
  id?: string
  onNoDataEvent?: () => void
  onLoadedEvent?: () => void
}) => void

export const useTradingViewEvent: UseTradingViewEvent = ({ id, onNoDataEvent, onLoadedEvent }) => {
  useEffect(() => {
    const onNoDataAvailable = (event: MessageEvent) => {
      const payload = event.data
      if (payload.name === TradingViewEvent.NoData && id && payload.frameElementId === id) onNoDataEvent?.()
      if (payload.name === TradingViewEvent.Load && id && payload.frameElementId === id) onLoadedEvent?.()
    }

    window.addEventListener('message', onNoDataAvailable)

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('message', onNoDataAvailable)
    }
  }, [id, onNoDataEvent, onLoadedEvent])
}

export default useTradingViewEvent
