const trades: any[] = []
const ids: string[] = []

class TradeFeed<T> {
  trades = []
  maxTrades = 200
  ids = []
  onUpdate: (() => void) | undefined = undefined

  constructor(onUpdate: () => void, maxTrades: number) {
    this.onUpdate = onUpdate
    this.maxTrades = maxTrades
  }

  next({ data }: any) {
    if (trades.length > 0 && data.swaps && data.swaps[0]) {
      if (ids.includes(data.swaps[0].id)) {
        return
      }

      if (trades.length === length) trades.pop()

      trades.unshift(data.swaps[0])
      ids.push(data.swaps[0].id)

      if (this.onUpdate) {
        this.onUpdate()
      }
    }
  }

  error(error: Error) {
    console.log(`Stream error: ${error.message}`)
  }

  complete() {
    console.log('Stream ended')
  }

  getObserver() {
    return {
      next: this.next,
      error: this.error,
      complete: this.complete,
    }
  }
}

export default TradeFeed
