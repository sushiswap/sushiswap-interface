// CONVENTION formatFoo -> string

import { BigNumber } from '@ethersproject/bignumber'
import Numeral from 'numeral'
import { getAddress } from '@ethersproject/address'

export const formatK = (value: string) => {
    return Numeral(value).format('0.[00]a')
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

// using a currency library here in case we want to add more in future
const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
})

export function formatPercent(percentString: any) {
    const percent = parseFloat(percentString)
    if (!percent || percent === 0) {
        return '0%'
    }
    if (percent < 0.0001 && percent > 0) {
        return '< 0.0001%'
    }
    if (percent < 0 && percent > -0.0001) {
        return '< 0.0001%'
    }
    const fixedPercent = percent.toFixed(2)
    if (fixedPercent === '0.00') {
        return '0%'
    }
    if (Number(fixedPercent) > 0) {
        if (Number(fixedPercent) > 100) {
            return `${percent?.toFixed(0).toLocaleString()}%`
        } else {
            return `${fixedPercent}%`
        }
    } else {
        return `${fixedPercent}%`
    }
}

export const formatNumber = (number: any, usd = false) => {
    if (isNaN(number) || number === '' || number === undefined) {
        return usd ? '$0.00' : '0'
    }
    const num = parseFloat(number)

    if (num > 500000000) {
        return (usd ? '$' : '') + formatK(num.toFixed(0))
    }

    if (num === 0) {
        if (usd) {
            return '$0.00'
        }
        return '0'
    }

    if (num < 0.0001 && num > 0) {
        return usd ? '< $0.0001' : '< 0.0001'
    }

    if (num > 1000) {
        return usd
            ? '$' + Number(parseFloat(String(num)).toFixed(0)).toLocaleString()
            : '' + Number(parseFloat(String(num)).toFixed(0)).toLocaleString()
    }

    if (usd) {
        if (num < 0.1) {
            return '$' + Number(parseFloat(String(num)).toFixed(4))
        } else {
            const usdString = priceFormatter.format(num)
            return '$' + usdString.slice(1, usdString.length)
        }
    }

    return parseFloat(String(num)).toPrecision(4)
}

export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}
