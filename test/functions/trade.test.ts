import { ChainId, Token, TokenAmount } from '@sushiswap/sdk'
import {
    calculateGasMargin,
    calculateSlippageAmount,
} from '../../src/functions/trade'

import { AddressZero } from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'

describe('#calculateSlippageAmount', () => {
    it('bounds are correct', () => {
        const tokenAmount = new TokenAmount(
            new Token(ChainId.MAINNET, AddressZero, 0),
            '100'
        )
        expect(() => calculateSlippageAmount(tokenAmount, -1)).toThrow()
        expect(
            calculateSlippageAmount(tokenAmount, 0).map((bound) =>
                bound.toString()
            )
        ).toEqual(['100', '100'])
        expect(
            calculateSlippageAmount(tokenAmount, 100).map((bound) =>
                bound.toString()
            )
        ).toEqual(['99', '101'])
        expect(
            calculateSlippageAmount(tokenAmount, 200).map((bound) =>
                bound.toString()
            )
        ).toEqual(['98', '102'])
        expect(
            calculateSlippageAmount(tokenAmount, 10000).map((bound) =>
                bound.toString()
            )
        ).toEqual(['0', '200'])
        expect(() => calculateSlippageAmount(tokenAmount, 10001)).toThrow()
    })
})

describe('#calculateGasMargin', () => {
    it('adds 10%', () => {
        expect(calculateGasMargin(BigNumber.from(1000)).toString()).toEqual(
            '1100'
        )
        expect(calculateGasMargin(BigNumber.from(50)).toString()).toEqual('55')
    })
})
