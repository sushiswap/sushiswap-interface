import { AddressMap, ChainId } from '@sushiswap/core-sdk'

export const QUERY_REQUEST_LIMIT = 10000

export const AUTONOMY_REGISTRY_ADDRESSES: AddressMap = {
  [ChainId.BSC]: '0x18d087F8D22D409D3CD366AF00BD7AeF0BF225Db',
  [ChainId.AVALANCHE]: '0x68FCbECa74A7E5D386f74E14682c94DE0e1bC56b',
}

export const STOP_LIMIT_ORDER_WRAPPER_ADDRESSES: AddressMap = {
  [ChainId.AVALANCHE]: '0x2f57dabe3dd1ecAed3F79a0D6d2530fCa5A11912',
}

export const CHAINLINK_ORACLE_ADDRESS: AddressMap = {
  [ChainId.BSC]: '0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB',
  [ChainId.AVALANCHE]: '0x232d595594585613F48aaE9c85861E4aB06CE3E5',
}

interface MoralisInfo {
  serverURL: string
  key: string
}

export const MORALIS_INFO: { [chainId: number]: MoralisInfo } = {
  [ChainId.AVALANCHE]: {
    serverURL: process.env.NEXT_PUBLIC_AUTONOMY_MORALIS_URL_AVAX || '',
    key: process.env.NEXT_PUBLIC_AUTONOMY_MORALIS_KEY_AVAX || '',
  },
  [ChainId.BSC]: {
    serverURL: process.env.NEXT_PUBLIC_AUTONOMY_MORALIS_URL_BSC || '',
    key: process.env.NEXT_PUBLIC_AUTONOMY_MORALIS_KEY_BSC || '',
  },
}
