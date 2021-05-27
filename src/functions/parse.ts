import { ethers } from 'ethers'

export const parseBalance = (value: string, decimals = 18) => {
    return ethers.utils.parseUnits(value || '0', decimals)
}
