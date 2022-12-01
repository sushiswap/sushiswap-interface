import { ChainId, Token, USDC, WNATIVE } from '@figswap/core-sdk'

// TODO (amiller68): #FilecoinMainnet - Add Filecoin Mainnet Tokens where appropriate

type ChainTokenList = {
  readonly [chainId: number]: Token[]
}

const WRAPPED_NATIVE_ONLY: ChainTokenList = {
  // TODO (amiller68): Is this correct?
  [ChainId.WALLABY]: [WNATIVE[ChainId.WALLABY]],
}

// Used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.WALLABY]: [...WRAPPED_NATIVE_ONLY[ChainId.WALLABY], USDC[ChainId.WALLABY]],
}

// TODO (amiller68): #Research Additional Base Tokens
export const ADDITIONAL_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] }
} = {
  // ex: 
  // [ChainId.ETHEREUM]: {
  //   [ETHEREUM.FEI.address]: [ETHEREUM.DPI],
  //   [ETHEREUM.FRAX.address]: [ETHEREUM.FXS],
  //   ...
  //   [ETHEREUM.WBTC.address]: [ETHEREUM.RENBTC]
  // },
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] }
} = {
  // ex:
  // [ChainId.ETHEREUM]: {
  //   [ETHEREUM.AMPL.address]: [ETHEREUM.DAI, WNATIVE[ChainId.ETHEREUM]],
  // },
}

/**
 * Shows up in the currency select for swap and add liquidity
 * These tokens should have good liquidity on FigSwap
 */
export const COMMON_BASES: ChainTokenList = {
  [ChainId.WALLABY]: [
    WNATIVE[ChainId.WALLABY], USDC[ChainId.WALLABY]
  ]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.WALLABY]: [
    WNATIVE[ChainId.WALLABY],
    USDC[ChainId.WALLABY],
  ]
}

// These are the tokens that are pinned to the top of the list in the token selector
export const PINNED_PAIRS: { readonly [chainId: number]: [Token, Token][] } = {
  [ChainId.WALLABY]: [
    [USDC[ChainId.WALLABY], WNATIVE[ChainId.WALLABY]],
  ],
}
