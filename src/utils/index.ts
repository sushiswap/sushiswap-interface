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
