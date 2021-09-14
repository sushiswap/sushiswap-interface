import { ChainId, Token, TokenAmount } from '@sushiswap/sdk'
import { calculateGasMargin, calculateSlippageAmount } from '../../../../src/functions/trade'

import { AddressZero } from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'

describe('#calculateSlippageAmount', () => {
  it('bounds are correct', () => {
    const tokenAmount = new TokenAmount(new Token(ChainId.MAINNET, AddressZero, 0), '100')
    expect(() => calculateSlippageAmount(tokenAmount, -1)).to.throw()
    expect(calculateSlippageAmount(tokenAmount, 0).map((bound) => bound.toString())).to.equal(['100', '100'])
    expect(calculateSlippageAmount(tokenAmount, 100).map((bound) => bound.toString())).to.equal(['99', '101'])
    expect(calculateSlippageAmount(tokenAmount, 200).map((bound) => bound.toString())).to.equal(['98', '102'])
    expect(calculateSlippageAmount(tokenAmount, 10000).map((bound) => bound.toString())).to.equal(['0', '200'])
    expect(() => calculateSlippageAmount(tokenAmount, 10001)).to.throw()
  })
})

describe('#calculateGasMargin', () => {
  it('adds 10%', () => {
    expect(calculateGasMargin(BigNumber.from(1000)).toString()).to.equal('1100')
    expect(calculateGasMargin(BigNumber.from(50)).toString()).to.equal('55')
  })
})
