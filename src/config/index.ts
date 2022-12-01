import { ChainId } from '@figswap/core-sdk'

const config = {
  // Global configuration

  // TODO (amiller68): #FilecoinMainnet - Change this to ChainId.FILECOIN_MAINNET
  defaultChainId: ChainId.WALLABY,

  // TODO (amiller68): Research what these are and what they do
  blockedAddresses: [
    // Note (amiller68): Example of blocked addresses in the original code
    // SDN OFAC addresses - 08.11.2022
    // "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
    // "0xa0e1c89Ef1a489c9C7dE96311eD5Ce5D32c20E4B",
    // ...
    // "0x7FF9cFad3877F21d41Da833E2F775dB0569eE3D9"
  ],

  // Network specific configuration
  [ChainId.WALLABY]: {
    averageBlockTime: 30, // TODO (amiller68): Is this correct?
  },
  // TODO (amiller68): #FilecoinMainnet - Add Mainnet defaults

  // Note (amiller68): Example of Ethereum Mainnet config
  // [ChainId.ETHEREUM]: {
  //   averageBlockTimeInSeconds: 13,
  //   kashi: { blacklistedTokens: [], blacklistedOracles: ['0x8f2CC3376078568a04eBC600ae5F0a036DBfd812'] },
  // },
}

export default config
