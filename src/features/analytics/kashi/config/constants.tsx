import { ChainIdEnum } from '../types/Enums'

export const API_URL: string = process.env.API_URL || 'http://localhost:8000'

export const CHAIN_RPC_URLS = {
  [ChainIdEnum.Ethereum]: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  [ChainIdEnum.Gnosis]: 'https://blockscout.com/xdai/mainnet/api/eth-rpc',
}
