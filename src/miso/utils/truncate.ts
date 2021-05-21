// truncate string to limited length
export default function truncate(address: string, charsLength = 4): string {
    const prefixLength = 2 // "0x"
    if (!address) {
        return ''
    }
    if (address.length < charsLength * 2 + prefixLength) {
        return address
    }
    return address.slice(0, charsLength + prefixLength) + '…' + address.slice(-charsLength)
}
