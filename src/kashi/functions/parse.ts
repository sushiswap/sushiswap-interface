import { getAddress } from '@ethersproject/address'

// parseAddress ensures the returned address is a checksummed address
export function parseAddress(address: string): string {
    return getAddress(address)
}
