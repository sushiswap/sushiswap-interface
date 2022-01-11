import { BigNumber } from '@ethersproject/bignumber'
import { formatNumber, formatPercent } from 'app/functions/format'
import { getUSDString } from 'app/functions/kashi'

export enum Direction {
  DOWN = -1,
  FLAT = 0,
  UP = 1,
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
      direction: direction,
    })
    return this
  }

  public addTokenAmount(name: string, from: BigNumber, to: BigNumber, token: any): this {
    this.add(
      name,
      formatNumber(from.toFixed(token.tokenInfo.decimals)) + ' ' + token.tokenInfo.symbol,
      formatNumber(to.toFixed(token.tokenInfo.decimals)) + ' ' + token.tokenInfo.symbol,
      from.eq(to) ? Direction.FLAT : from.lt(to) ? Direction.UP : Direction.DOWN
    )
    return this
  }

  public addUSD(name: string, from: BigNumber, to: BigNumber, token: any): this {
    this.add(
      name,
      formatNumber(getUSDString(from, token), true),
      formatNumber(getUSDString(to, token), true),
      from.eq(to) ? Direction.FLAT : from.lt(to) ? Direction.UP : Direction.DOWN
    )
    return this
  }

  public addPercentage(name: string, from: BigNumber, to: BigNumber): this {
    this.add(
      name,
      formatPercent(from.toFixed(16)),
      formatPercent(to.toFixed(16)),
      from.eq(to) ? Direction.FLAT : from.lt(to) ? Direction.UP : Direction.DOWN
    )
    return this
  }

  public addRate(name: string, from: BigNumber, to: BigNumber, pair: any): this {
    this.add(
      name,
      formatNumber(from.toFixed(18 + pair.collateral.tokenInfo.decimals - pair.asset.tokenInfo.decimals)),
      formatNumber(to.toFixed(18 + pair.collateral.tokenInfo.decimals - pair.asset.tokenInfo.decimals)),
      from.eq(to) ? Direction.FLAT : from.lt(to) ? Direction.UP : Direction.DOWN
    )
    return this
  }
}
