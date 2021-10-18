import { parseCallKey, toCallKey } from './utils'

describe('actions', () => {
  describe('#parseCallKey', () => {
    it('does not throw for invalid address', () => {
      expect(parseCallKey('0x-0x')).toEqual({ address: '0x', callData: '0x' })
    })
    it('does not throw for invalid calldata', () => {
      expect(parseCallKey('0x6b175474e89094c44da98b954eedeac495271d0f-abc')).toEqual({
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        callData: 'abc',
      })
    })
    it('throws for invalid format', () => {
      expect(() => parseCallKey('abc')).toThrow('Invalid call key: abc')
    })
    it('throws for uppercase calldata', () => {
      expect(parseCallKey('0x6b175474e89094c44da98b954eedeac495271d0f-0xabcD')).toEqual({
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        callData: '0xabcD',
      })
    })
    it('parses pieces into address', () => {
      expect(parseCallKey('0x6b175474e89094c44da98b954eedeac495271d0f-0xabcd')).toEqual({
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        callData: '0xabcd',
      })
    })
  })

  describe('#toCallKey', () => {
    it('concatenates address to data', () => {
      expect(
        toCallKey({
          address: '0x6b175474e89094c44da98b954eedeac495271d0f',
          callData: '0xabcd',
        })
      ).toEqual('0x6b175474e89094c44da98b954eedeac495271d0f-0xabcd')
    })
    it('concatenates gasRequired to data', () => {
      expect(
        toCallKey({
          address: '0x6b175474e89094c44da98b954eedeac495271d0f',
          callData: '0xabcd',
          gasRequired: 1000,
        })
      ).toEqual('0x6b175474e89094c44da98b954eedeac495271d0f-0xabcd-1000')
    })
    it('throws for unsafe integer', () => {
      expect(() => toCallKey({ callData: '0x', address: '0x', gasRequired: Math.pow(2, 53) })).toThrow(
        `Invalid number: ${Math.pow(2, 53)}`
      )
    })
  })
})
