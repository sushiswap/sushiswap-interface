import { BigNumber } from '@ethersproject/bignumber'
import { getUSDString } from 'kashi/functions/kashi'
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
    public add(name: string, from: string, to: string, direction: Direction): this {
        this.push({
            name: name,
            from: from,
            to: to,
            direction: direction
        })
        return this
    }

    public addTokenAmount(name: string, from: BigNumber, to: BigNumber, token: any): this {
        this.add(
            name,
            formattedNum(from.toFixed(token.decimals)) + ' ' + token.symbol,
            formattedNum(to.toFixed(token.decimals)) + ' ' + token.symbol,
            from.eq(to) ? Direction.FLAT : from.lt(to) ? Direction.UP : Direction.DOWN
        )
        return this
    }

    public addUSD(name: string, from: BigNumber, to: BigNumber, token: any): this {
        this.add(
            name,
            formattedNum(getUSDString(from, token), true),
            formattedNum(getUSDString(to, token), true),
            from.eq(to) ? Direction.FLAT : from.lt(to) ? Direction.UP : Direction.DOWN
        )
        return this
    }

    public addPercentage(name: string, from: BigNumber, to: BigNumber): this {
        this.add(
            name,
            formattedPercent(from.toFixed(16)),
            formattedPercent(to.toFixed(16)),
            from.eq(to) ? Direction.FLAT : from.lt(to) ? Direction.UP : Direction.DOWN
        )
        return this
    }

    public addRate(name: string, from: BigNumber, to: BigNumber, pair: any): this {
        this.add(
            name,
            formattedNum(from.toFixed(18 + pair.collateral.decimals - pair.asset.decimals)),
            formattedNum(to.toFixed(18 + pair.collateral.decimals - pair.asset.decimals)),
            from.eq(to) ? Direction.FLAT : from.lt(to) ? Direction.UP : Direction.DOWN
        )
        return this
    }
}
