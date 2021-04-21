import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Fraction } from 'entities'

/// <reference types="react-scripts" />

declare module '@ethersproject/bignumber' {
    interface BigNumber {
        muldiv(multiplier: BigNumberish, divisor: BigNumberish): BigNumber
        toFixed(decimals: BigNumberish): string
        toFraction(decimals: BigNumberish, base: BigNumberish): Fraction
    }
}

declare global {
    interface String {
        toBigNumber(decimals: number): BigNumber
    }
}

declare module 'jazzicon' {
    export default function(diameter: number, seed: number): HTMLElement
}

declare module 'fortmatic'

interface Window {
    ethereum?: {
        isMetaMask?: true
        on?: (...args: any[]) => void
        removeListener?: (...args: any[]) => void
        autoRefreshOnNetworkChange?: boolean
    }
    web3?: {}
}

declare module 'content-hash' {
    declare function decode(x: string): string
    declare function getCodec(x: string): string
}

declare module 'multihashes' {
    declare function decode(buff: Uint8Array): { code: number; name: string; length: number; digest: Uint8Array }
    declare function toB58String(hash: Uint8Array): string
}
