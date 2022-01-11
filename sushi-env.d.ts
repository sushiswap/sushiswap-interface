import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

import Fraction from './src/entities/bignumber/Fraction'

declare module 'fortmatic'

declare global {
  interface String {
    toBigNumber(decimals: number): BigNumber
  }
  interface Window {
    walletLinkExtension?: any
    ethereum?: {
      isCoinbaseWallet?: true
      isMetaMask?: true
      on?: (...args: any[]) => void
      removeListener?: (...args: any[]) => void
      removeAllListeners?: (...args: any[]) => void
      autoRefreshOnNetworkChange?: boolean
    }
    web3?: Record<string, unknown>
  }
}

declare module 'content-hash' {
  declare function decode(x: string): string
  declare function getCodec(x: string): string
}

declare module 'multihashes' {
  declare function decode(buff: Uint8Array): {
    code: number
    name: string
    length: number
    digest: Uint8Array
  }
  declare function toB58String(hash: Uint8Array): string
}

declare module 'jazzicon' {
  export default function (diameter: number, seed: number): HTMLElement
}

declare module 'formatic'

declare module '@ethersproject/bignumber' {
  interface BigNumber {
    mulDiv(multiplier: BigNumberish, divisor: BigNumberish): BigNumber
    toFixed(decimals: BigNumberish): string
    toFraction(decimals: BigNumberish, base: BigNumberish): Fraction
    min(...values: BigNumberish[]): BigNumber
    max(...values: BigNumberish[]): BigNumber
  }
}
