import axios from 'axios'
import qs from 'qs'

import { COINGECKO } from '../../config/coingecko'
const baseURI = 'https://api.coingecko.com/api/v3'

interface Coin {
  id: string
  name: string
  symbol: string
  price?: number
}

class CoinGeckoService {
  protected static instance: CoinGeckoService
  protected coinsList?: Coin[]
  constructor() {}

  protected async getCoinsList(): Promise<Coin[]> {
    if (this.coinsList) {
      return this.coinsList
    }
    const { data }: { data: Coin[] } = await axios.get(`${baseURI}/coins/list`)
    this.coinsList = data
    return this.coinsList
  }

  protected async getIds(symbols: string[]) {
    const ids = symbols.map((symbol) => {
      return COINGECKO.tokens[symbol] || ''
    })
    return ids
  }

  protected async parsePrices(symbols: string[], prices: { [key: string]: { usd: number } }) {
    const pricesMap = {} as { [key: string]: BigInt }
    symbols.forEach((symbol) => {
      const price = prices[COINGECKO.tokens[symbol]]?.usd || 0
      pricesMap[symbol] = BigInt(Math.round(price) * Math.pow(10, 8))
    })
    return pricesMap
  }

  async getPrices(symbols: string[]): Promise<{ [key: string]: BigInt }> {
    const ids = await this.getIds(symbols)
    const query = {
      ids: ids.join(','),
      vs_currencies: 'usd',
    }
    const { data } = await axios.get(`${baseURI}/simple/price${qs.stringify(query, { addQueryPrefix: true })}`)

    return this.parsePrices(symbols, data)
  }

  static getInstance() {
    if (CoinGeckoService.instance) {
      return CoinGeckoService.instance
    }
    CoinGeckoService.instance = new CoinGeckoService()
    return CoinGeckoService.instance
  }
}

export default CoinGeckoService
