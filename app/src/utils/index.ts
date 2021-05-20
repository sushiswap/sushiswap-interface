import { BigNumber } from '@ethersproject/bignumber'
import { Fraction } from '../entities'
import { ethers } from 'ethers'
import { formatK } from '../functions/format'

// NOTE: Try not to add anything to thie file or folder, it's almost entirely refactored out.

export const formatFromBalance = (value: BigNumber | undefined, decimals = 18): string => {
    if (value) {
        return Fraction.from(BigNumber.from(value), BigNumber.from(10).pow(decimals)).toString()
    }
    return ''
}
export const formatToBalance = (value: string | undefined, decimals = 18) => {
    if (value) {
        return { value: ethers.utils.parseUnits(Number(value).toFixed(decimals), decimals), decimals: decimals }
    }
    return { value: BigNumber.from(0), decimals: decimals }
}

export const formatBalance = (value: ethers.BigNumberish, decimals = 18, maxFraction = 0) => {
    const formatted = ethers.utils.formatUnits(value, decimals)
    if (maxFraction > 0) {
        const split = formatted.split('.')
        if (split.length > 1) {
            return split[0] + '.' + split[1].substr(0, maxFraction)
        }
    }
    return formatted
}

export const parseBalance = (value: string, decimals = 18) => {
    return ethers.utils.parseUnits(value || '0', decimals)
}

// using a currency library here in case we want to add more in future
const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

export function formattedPercent(percentString: any) {
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

export const formattedNum = (number: any, usd = false) => {
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

export function rpcToObj(rpc_obj: any, obj?: any) {
    if (rpc_obj instanceof BigNumber) {
        return rpc_obj
    }
    if (!obj) {
        obj = {}
    }
    if (typeof rpc_obj == 'object') {
        if (Object.keys(rpc_obj).length && isNaN(Number(Object.keys(rpc_obj)[Object.keys(rpc_obj).length - 1]))) {
            for (const i in rpc_obj) {
                if (isNaN(Number(i))) {
                    obj[i] = rpcToObj(rpc_obj[i])
                }
            }
            return obj
        }
        return rpc_obj.map((item: any) => rpcToObj(item))
    }
    return rpc_obj
}
