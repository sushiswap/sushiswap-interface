// shorten string to its maximum length using three dots

export default function shortenString(string: string, length: number): string {
    if (!string) return ''
    if (length < 5) return string
    if (string.length <= length) return string
    return string.slice(0, 4) + '...' + string.slice(string.length - length + 5, string.length)
}
