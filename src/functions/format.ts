// CONVENTION formatFoo -> string

import { BigNumber } from '@ethersproject/bignumber'
import Numeral from 'numeral'
import { getAddress } from '@ethersproject/address'

export const formatK = (value: string) => {
    return Numeral(value).format('0.[00]a')
}

export function formatNumber(value: BigNumber | Number): string {
    return ''
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
    try {
        const parsed = getAddress(address)
        return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
    } catch (error) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }
}

// shorten string to its maximum length using three dots
export function shortenString(string: string, length: number): string {
    if (!string) return ''
    if (length < 5) return string
    if (string.length <= length) return string
    return string.slice(0, 4) + '...' + string.slice(string.length - length + 5, string.length)
}
