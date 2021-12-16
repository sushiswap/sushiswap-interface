import { ChainId, AddressMap } from '@sushiswap/sdk'

export enum ONSEN_CATEGORY {
  ALL,
  KASHI,
  NFT_INDEX,
  BLUE_CHIP,
  NEWLY_ADDED,
  TOP_MOVER,
  STABLE_COIN,
}

export enum ONSEN_VIEWS {
  ALL_POOLS,
  USER_POOLS,
}

export const OLD_FARMS: AddressMap = {
  [ChainId.CELO]: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
}
