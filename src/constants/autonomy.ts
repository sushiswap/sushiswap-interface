import { AddressMap, ChainId } from '@sushiswap/core-sdk'

export const QUERY_REQUEST_LIMIT = 10000

export const AUTONOMY_REGISTRY_ADDRESSES: AddressMap = {
  [ChainId.ETHEREUM]: '0x973107d4b9A5B69fd99c23a3C31eFA8fafE7Ae38',
  [ChainId.FANTOM]: '0x6e5Ec7f4C98B34e0aAAA02D8D2136e626ED33B10',
  [ChainId.BSC]: '0x18d087F8D22D409D3CD366AF00BD7AeF0BF225Db',
  [ChainId.AVALANCHE]: '0x68FCbECa74A7E5D386f74E14682c94DE0e1bC56b',
  [ChainId.MATIC]: '0x18d02301E534cab22267460eD8fBdf2B8382A3ff',
}

export const STOP_LIMIT_ORDER_WRAPPER_ADDRESSES: AddressMap = {
  [ChainId.ETHEREUM]: '0xeE1e77774225Fc9c1a4B5B32E0029c1768A9f338',
  [ChainId.FANTOM]: '0xe2952F019d317d9e9FadaeeD4F61dF5879295c17',
  [ChainId.AVALANCHE]: '0x2f57dabe3dd1ecAed3F79a0D6d2530fCa5A11912',
  [ChainId.MATIC]: '0x849F9303AC8fb345e3D07c78A6795d1989d9CE16',
}

export const CHAINLINK_ORACLE_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB',
  [ChainId.FANTOM]: '0x4a8C72c1e443d2199D7D65D8EAE6cA7ac1E58226',
  [ChainId.BSC]: '0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB',
  [ChainId.AVALANCHE]: '0x232d595594585613F48aaE9c85861E4aB06CE3E5',
  [ChainId.MATIC]: '0x4455AbEc4E3310F5Ba427D4Dd49e590c2A27f7d5',
}

type FeeAmountOfEthMap = {
  [chainId: number]: string
}
// it defines minimum amount of fee(ETH unit) that Autonomy wrapper contract charges when to execute orders.
export const STOP_LIMIT_ORDER_WRAPPER_FEE_MINIMUM: FeeAmountOfEthMap = {
  [ChainId.ETHEREUM]: '0.007', // 0.007 ETH
  [ChainId.FANTOM]: '0.1', // 0.1 FTM
  [ChainId.AVALANCHE]: '0.025', // 0.025 AVAX
  [ChainId.MATIC]: '0.03', // 0.03 MATIC
}

interface MoralisInfo {
  serverURL: string
  key: string
}

export const MORALIS_INFO: { [chainId: number]: MoralisInfo } = {
  [ChainId.ETHEREUM]: {
    serverURL: process.env.NEXT_PUBLIC_AUTONOMY_MORALIS_URL_ETH || '',
    key: process.env.NEXT_PUBLIC_AUTONOMY_MORALIS_KEY_ETH || '',
  },
  [ChainId.FANTOM]: {
    serverURL: process.env.NEXT_PUBLIC_AUTONOMY_MORALIS_URL_FTM || '',
    key: process.env.NEXT_PUBLIC_AUTONOMY_MORALIS_KEY_FTM || '',
  },
  [ChainId.AVALANCHE]: {
    serverURL: process.env.NEXT_PUBLIC_AUTONOMY_MORALIS_URL_AVAX || '',
    key: process.env.NEXT_PUBLIC_AUTONOMY_MORALIS_KEY_AVAX || '',
  },
  [ChainId.MATIC]: {
    serverURL: process.env.NEXT_PUBLIC_AUTONOMY_MORALIS_URL_MATIC || '',
    key: process.env.NEXT_PUBLIC_AUTONOMY_MORALIS_KEY_MATIC || '',
  },
  [ChainId.BSC]: {
    serverURL: process.env.NEXT_PUBLIC_AUTONOMY_MORALIS_URL_BSC || '',
    key: process.env.NEXT_PUBLIC_AUTONOMY_MORALIS_KEY_BSC || '',
  },
}
