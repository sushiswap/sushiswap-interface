import { getAddress } from '@ethersproject/address'

// parseValue ensures the value is a number and within accepted range.
export function parseValue(value: number): number {
    const val: number = parseFloat(value.toString())

    if (isNaN(val)) {
        throw new Error(`Input value is not a number`)
    }
    if (val > Number.MAX_SAFE_INTEGER || val < Number.MIN_SAFE_INTEGER) {
        throw new RangeError('Input value is outside of safe integer range')
    }

    return val
}

// parseAddress ensures the returned address is a checksummed address
export function parseAddress(address: string): string {
    return getAddress(address)
}
