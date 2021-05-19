/// <reference types="next" />
/// <reference types="next/types/global" />

import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Fraction } from '../entities/Fraction'

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

declare module 'react-tradingview-widget'

declare module 'jazzicon' {
    export default function(diameter: number, seed: number): HTMLElement
}

declare module 'fortmatic'

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

import type { NextComponentType, NextPageContext, NextLayoutComponentType } from 'next';
import type { AppProps } from 'next/app';

declare module 'next' {
  type NextLayoutComponentType<P = {}> = NextComponentType<NextPageContext, any, P> & {
    getLayout?: (page: ReactNode) => ReactNode;
  };

  type NextLayoutPage<P = {}, IP = P> = NextComponentType<NextPageContext, IP, P> & {
    getLayout: (page: ReactNode) => ReactNode;
  };
}

declare module 'next/app' {
  type AppLayoutProps<P = {}> = AppProps & {
    Component: NextLayoutComponentType;
  };
}