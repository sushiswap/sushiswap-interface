// CONVENTION isFoo -> boolean

import { ChainId, Currency, Token } from '@sushiswap/sdk'

import { BigNumber } from 'ethers'
import { TokenAddressMap } from '../state/lists/hooks'
import { getAddress } from '@ethersproject/address'

/**
 * Returns true if the string value is zero in hex
 * @param hexNumberString
 */
export function isZero(hexNumberString: string): boolean {
    return /^0x0*$/.test(hexNumberString)
}

export const isEmptyValue = (text: string) =>
    BigNumber.isBigNumber(text)
        ? BigNumber.from(text).isZero()
        : text === '' || text.replace(/0/g, '').replace(/\./, '') === ''

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
    try {
        return getAddress(value)
    } catch {
        return false
    }
}

export function isTokenOnList(
    defaultTokens: TokenAddressMap,
    currency?: Currency,
    chainId = ChainId.MAINNET
): boolean {
    if (currency === Currency.getNativeCurrency(chainId)) return true
    return Boolean(
        currency instanceof Token &&
            defaultTokens[currency.chainId]?.[currency.address]
    )
}
