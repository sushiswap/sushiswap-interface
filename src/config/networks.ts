import { ChainId } from '@figswap/core-sdk'

const Wallaby = 'https://cryptologos.cc/logos/filecoin-fil-logo.svg?v=007'
// TODO (amiller68): #FilecoinMainnet - Add Filecoin Mainnet
// const Filecoin = "https://crytpologos.cc/logos/filecoin-fil-logo.svg?v=007"

export const NETWORK_ICON: Record<number, string> = {
  [ChainId.WALLABY]: Wallaby,
  // TODO (amiller68): #FilecoinMainnet - Add Filecoin Mainnet
  // [ChainId.FILECOIN]: Filecoin,
}

export const NETWORK_LABEL: Record<number, string> = {
  [ChainId.WALLABY]: 'Wallaby',
  // TODO (amiller68): #FilecoinMainnet - Add Filecoin Mainnet
  // [ChainId.FILECOIN]: 'Filecoin',
}
