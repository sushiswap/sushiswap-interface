export default function textCheck(str: string): string {
    const pattern = /^[()\s0-9a-zA-Z]+$/
    if (str && str.match(pattern)) {
        return str
    } else {
        return `-`
    }
}
