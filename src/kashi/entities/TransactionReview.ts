import { BigNumber } from '@ethersproject/bignumber'
import { formattedNum, formattedPercent } from 'utils'

export enum Direction {
    DOWN = -1,
    FLAT = 0,
    UP = 1
}

interface Line {
    name: string
    from: string
    to: string
    direction: Direction
}

export class TransactionReview extends Array<Line> {
    public add(name: string, from: string, to: string, direction: Direction): TransactionReview {
        this.push({
            name: name,
            from: from,
            to: to,
            direction: direction
        })
        return this
    }

    public addTokenAmount(name: string, from: BigNumber, to: BigNumber, token: any): TransactionReview {
        this.add(
            name,
            formattedNum(from.toFixed(token.decimals)) + ' ' + token.symbol,
            formattedNum(to.toFixed(token.decimals)) + ' ' + token.symbol,
            from.eq(to) ? Direction.FLAT : from.lt(to) ? Direction.UP : Direction.DOWN
        )
        return this
    }

    public addPercentage(name: string, from: BigNumber, to: BigNumber) {
        this.add(
            name,
            formattedPercent(from.toFixed(16)),
            formattedPercent(to.toFixed(16)),
            from.eq(to) ? Direction.FLAT : from.lt(to) ? Direction.UP : Direction.DOWN
        )
        return this
    }
}
