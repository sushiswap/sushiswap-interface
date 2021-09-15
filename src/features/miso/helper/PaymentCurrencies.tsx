import { TETHER_ADDRESS, USDC_ADDRESS, SUSHI_ADDRESS, DAI_ADDRESS } from '../../../constants/miso'

const paymentCurrencies = {
  ETH: {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  USDC: {
    addressSet: USDC_ADDRESS,
    address: '',
    name: 'Ethereum',
    symbol: 'USDC',
    decimals: 6,
  },
  USDT: {
    addressSet: TETHER_ADDRESS,
    address: '',
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
  },
  DAI: {
    addressSet: DAI_ADDRESS,
    address: '',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
  },
  SUSHI: {
    addressSet: SUSHI_ADDRESS,
    address: '',
    name: 'SushiToken',
    symbol: 'SUSHI',
    decimals: 18,
  },
}

export const getPaymentCurrency = (symbol, chainId) => {
  var currency = Object.assign({}, paymentCurrencies[symbol])

  if (symbol == 'ETH') return currency

  currency.address = currency.addressSet[chainId]
  return currency
}
