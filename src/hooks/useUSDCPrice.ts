import {
    ChainId,
    Currency,
    JSBI,
    Price,
    Token,
    WETH,
    currencyEquals,
} from '@sushiswap/sdk'
import { PairState, usePairs } from './usePairs'

import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { wrappedCurrency } from '../functions/currency/wrappedCurrency'

export const USDC = {
    [ChainId.MAINNET]: new Token(
        ChainId.MAINNET,
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        6,
        'USDC',
        'USD Coin'
    ),
    [ChainId.ROPSTEN]: new Token(
        ChainId.ROPSTEN,
        '0x0D9C8723B343A8368BebE0B5E89273fF8D712e3C',
        6,
        'USDC',
        'USD Coin'
    ),
    [ChainId.KOVAN]: new Token(
        ChainId.KOVAN,
        '0xb7a4F3E9097C08dA09517b5aB877F7a917224ede',
        6,
        'USDC',
        'USD Coin'
    ),
    [ChainId.MATIC]: new Token(
        ChainId.MATIC,
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        6,
        'USDC',
        'USD Coin'
    ),
    [ChainId.FANTOM]: new Token(
        ChainId.FANTOM,
        '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
        6,
        'USDC',
        'USD Coin'
    ),
    [ChainId.BSC]: new Token(
        ChainId.BSC,
        '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
        6,
        'USDC',
        'USD Coin'
    ),
    [ChainId.HARMONY]: new Token(
        ChainId.HARMONY,
        '0x985458E523dB3d53125813eD68c274899e9DfAb4',
        6,
        'USDC',
        'USD Coin'
    ),
    [ChainId.HECO]: new Token(
        ChainId.HECO,
        '0x9362Bbef4B8313A8Aa9f0c9808B80577Aa26B73B',
        6,
        'USDC',
        'USD Coin'
    ),
    [ChainId.OKEX]: new Token(
        ChainId.OKEX,
        '0xc946DAf81b08146B1C7A8Da2A851Ddf2B3EAaf85',
        6,
        'USDC',
        'USD Coin'
    ),
    [ChainId.XDAI]: new Token(
        ChainId.XDAI,
        '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
        6,
        'USDC',
        'USD Coin'
    ),
}

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useUSDCPrice(currency?: Currency): Price | undefined {
    const { chainId } = useActiveWeb3React()

    if (!(chainId in USDC)) return undefined

    const wrapped = wrappedCurrency(currency, chainId)
    const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
        () => [
            [
                chainId && wrapped && currencyEquals(WETH[chainId], wrapped)
                    ? undefined
                    : currency,
                chainId ? WETH[chainId] : undefined,
            ],
            [
                wrapped?.equals(USDC[chainId]) ? undefined : wrapped,
                USDC[chainId],
            ],
            [chainId ? WETH[chainId] : undefined, USDC[chainId]],
        ],
        [chainId, currency, wrapped]
    )
    const [
        [ethPairState, ethPair],
        [usdcPairState, usdcPair],
        [usdcEthPairState, usdcEthPair],
    ] = usePairs(tokenPairs)

    return useMemo(() => {
        if (!currency || !wrapped || !chainId) {
            return undefined
        }
        // handle weth/eth
        if (wrapped.equals(WETH[chainId])) {
            if (usdcPair) {
                const price = usdcPair.priceOf(WETH[chainId])
                return new Price(
                    currency,
                    USDC[chainId],
                    price.denominator,
                    price.numerator
                )
            } else {
                return undefined
            }
        }
        // handle usdc
        if (wrapped.equals(USDC[chainId])) {
            return new Price(USDC[chainId], USDC[chainId], '1', '1')
        }

        const ethPairETHAmount = ethPair?.reserveOf(WETH[chainId])
        const ethPairETHUSDCValue: JSBI =
            ethPairETHAmount && usdcEthPair
                ? usdcEthPair.priceOf(WETH[chainId]).quote(ethPairETHAmount).raw
                : JSBI.BigInt(0)

        // all other tokens
        // first try the usdc pair
        if (
            usdcPairState === PairState.EXISTS &&
            usdcPair &&
            usdcPair.reserveOf(USDC[chainId]).greaterThan(ethPairETHUSDCValue)
        ) {
            const price = usdcPair.priceOf(wrapped)
            return new Price(
                currency,
                USDC[chainId],
                price.denominator,
                price.numerator
            )
        }
        if (
            ethPairState === PairState.EXISTS &&
            ethPair &&
            usdcEthPairState === PairState.EXISTS &&
            usdcEthPair
        ) {
            if (
                usdcEthPair.reserveOf(USDC[chainId]).greaterThan('0') &&
                ethPair.reserveOf(WETH[chainId]).greaterThan('0')
            ) {
                const ethUsdcPrice = usdcEthPair.priceOf(USDC[chainId])
                const currencyEthPrice = ethPair.priceOf(WETH[chainId])
                const usdcPrice = ethUsdcPrice
                    .multiply(currencyEthPrice)
                    .invert()
                return new Price(
                    currency,
                    USDC[chainId],
                    usdcPrice.denominator,
                    usdcPrice.numerator
                )
            }
        }
        return undefined
    }, [
        chainId,
        currency,
        ethPair,
        ethPairState,
        usdcEthPair,
        usdcEthPairState,
        usdcPair,
        usdcPairState,
        wrapped,
    ])
}
