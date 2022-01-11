import { CurrencyAmount, Token } from '@sushiswap/core-sdk'

import { serializeBalancesMap } from './hooks'

describe('Wallet Hooks', () => {
  describe('#serializeBalancesMap', () => {
    const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
    const ADDRESS_ONE = '0x0000000000000000000000000000000000000001'
    const ADDRESS_TWO = '0x0000000000000000000000000000000000000002'

    it('properly serializes mapping with one address', () => {
      const token = new Token(1, ADDRESS_ONE, 0)
      const amount = CurrencyAmount.fromRawAmount(token, 100)
      expect(
        serializeBalancesMap({
          [ADDRESS_ZERO]: amount,
        })
      ).toEqual(`[${ADDRESS_ONE} - 100]`)
    })

    it('properly serializes mapping with many addresses', () => {
      expect(
        serializeBalancesMap({
          [ADDRESS_ZERO]: CurrencyAmount.fromRawAmount(new Token(1, ADDRESS_ZERO, 0), 100),
          [ADDRESS_ONE]: CurrencyAmount.fromRawAmount(new Token(1, ADDRESS_ONE, 1), 1234),
          [ADDRESS_TWO]: CurrencyAmount.fromRawAmount(new Token(1, ADDRESS_TWO, 10), 795),
        })
      ).toEqual(`[${ADDRESS_ZERO} - 100],[${ADDRESS_ONE} - 123.4],[${ADDRESS_TWO} - 0.0000000795]`)
    })

    it('works with empty map', () => {
      expect(serializeBalancesMap({})).toEqual('')
    })
  })
})
