import { ChainId, Token } from 'sdk'

export const WALLABY_WFIL = new Token(
  ChainId.WALLABY,
  '0xeEFac6efBa8Da6F36C3C3d162E193914963AFF7d',
  18,
  'WFIL',
  'Wrapped FIL'
)

export const WALLABY_USDC = new Token(
  ChainId.WALLABY,
  '0xdF7AC8fd4330189409f3d4dA6DA22AE728742F44',
  6,
  'USDC',
  'USD Coin'
)

// TODO (amiller68): #FilecoinMainnet - Add Filecoin Mainnet Tokens
