import { Currency, CurrencyAmount, Fraction, JSBI, Percent, Price, Token, ZERO } from '@sushiswap/core-sdk'
import { AuctionStatus, AuctionTemplate, RawAuctionInfo, RawClaimInfo } from 'app/features/miso/context/types'

export class Auction {
  public readonly template: AuctionTemplate
  public readonly auctionToken: Token
  public readonly paymentToken: Currency
  public readonly auctionInfo: RawAuctionInfo
  public readonly claimInfo: RawClaimInfo
  public readonly isOwner: boolean

  public constructor({
    template,
    auctionToken,
    paymentToken,
    auctionInfo,
    isOwner,
    claimInfo,
  }: {
    template: AuctionTemplate
    auctionToken: Token
    paymentToken: Currency
    auctionInfo: RawAuctionInfo
    claimInfo: RawClaimInfo
    isOwner: boolean
  }) {
    this.template = template
    this.auctionToken = auctionToken
    this.auctionInfo = auctionInfo
    this.paymentToken = paymentToken
    this.isOwner = isOwner
    this.claimInfo = claimInfo
  }

  public get status(): AuctionStatus {
    const startTime = this.auctionInfo.startTime.mul('1000').toNumber()
    const endTime = this.auctionInfo.endTime.mul('1000').toNumber()
    const now = Date.now()

    if (now <= startTime) return AuctionStatus.UPCOMING
    if (now >= endTime) return AuctionStatus.FINISHED
    return AuctionStatus.LIVE
  }

  public get remainingTime(): { days: number; hours: number; minutes: number; seconds: number } | undefined {
    if (this.auctionInfo.endTime) {
      const now = Date.now()
      const interval = this.auctionInfo.endTime.mul('1000').toNumber() - now

      let days = Math.floor(interval / (1000 * 60 * 60 * 24))
      let hours = Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      let minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60))
      let seconds = Math.floor((interval % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds }
    }
  }

  public get rate(): CurrencyAmount<Currency> | undefined {
    if (this.auctionInfo.rate) {
      return CurrencyAmount.fromRawAmount(this.paymentToken, JSBI.BigInt(this.auctionInfo.rate))
    }
  }

  public get totalTokens(): CurrencyAmount<Token> | undefined {
    if (this.auctionInfo.totalTokens) {
      return CurrencyAmount.fromRawAmount(this.auctionToken, JSBI.BigInt(this.auctionInfo.totalTokens))
    }
  }

  public get totalTokensCommitted(): CurrencyAmount<Token> | undefined {
    if (this.auctionInfo.totalTokensCommitted) {
      return CurrencyAmount.fromRawAmount(this.auctionToken, JSBI.BigInt(this.auctionInfo.totalTokensCommitted))
    }
  }

  public get commitmentsTotal(): CurrencyAmount<Currency> | undefined {
    if (this.auctionInfo.commitmentsTotal) {
      return CurrencyAmount.fromRawAmount(this.paymentToken, JSBI.BigInt(this.auctionInfo.commitmentsTotal))
    }
  }

  public get currentPrice(): Price<Token, Currency> | undefined {
    if (this.template === AuctionTemplate.CROWDSALE) {
      if (this.auctionInfo.rate) {
        return new Price(
          this.auctionToken,
          this.paymentToken,
          JSBI.BigInt(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(this.auctionToken.decimals))),
          JSBI.BigInt(this.auctionInfo.rate)
        )
      }
    }

    if (this.template === AuctionTemplate.DUTCH_AUCTION) {
      const tPrice = this.tokenPrice
      const startTime = this.auctionInfo.startTime.mul('1000').toNumber()
      const endTime = this.auctionInfo.endTime.mul('1000').toNumber()
      const now = Date.now()

      if (now <= startTime) return this.startPrice
      if (now >= endTime) return this.reservePrice
      if (this.startPrice && this.reservePrice) {
        const { numerator, denominator } = this.startPrice.subtract(
          this.startPrice.subtract(this.reservePrice).multiply(new Fraction(now - startTime, endTime - startTime))
        )

        const fPrice = new Price(this.auctionToken, this.paymentToken, denominator, numerator)
        if (tPrice) {
          if (tPrice.greaterThan(fPrice)) return tPrice
          return fPrice
        }
      }
    }

    if (this.template === AuctionTemplate.BATCH_AUCTION) {
      return this.tokenPrice
    }
  }

  public get reservePrice(): Price<Token, Currency> | undefined {
    if (this.auctionInfo.minimumPrice) {
      return new Price(
        this.auctionToken,
        this.paymentToken,
        JSBI.BigInt(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(this.auctionToken.decimals))),
        JSBI.BigInt(this.auctionInfo.minimumPrice)
      )
    }
  }

  public get tokenPrice(): Price<Token, Currency> | undefined {
    if (this.commitmentsTotal && this.totalTokens) {
      return new Price(
        this.auctionToken,
        this.paymentToken,
        JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(this.paymentToken.decimals)),
        JSBI.divide(
          JSBI.multiply(
            this.commitmentsTotal.quotient,
            JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(this.auctionToken.decimals))
          ),
          this.totalTokens.quotient
        )
      )
    }
  }

  public get startPrice(): Price<Token, Currency> | undefined {
    if (this.auctionInfo.startPrice) {
      return new Price(
        this.auctionToken,
        this.paymentToken,
        JSBI.BigInt(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(this.auctionToken.decimals))),
        JSBI.BigInt(this.auctionInfo.startPrice)
      )
    }
  }

  public get minimumPrice(): Price<Token, Currency> | undefined {
    if (this.auctionInfo.minimumPrice) {
      return new Price(
        this.auctionToken,
        this.paymentToken,
        JSBI.BigInt(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(this.auctionToken.decimals))),
        JSBI.BigInt(this.auctionInfo.minimumPrice)
      )
    }
  }

  public get minimumCommitment(): CurrencyAmount<Currency> | undefined {
    if (this.template === AuctionTemplate.CROWDSALE) {
      if (this.totalTokens && this.rate) {
        const { denominator, numerator } = this.totalTokens.divide(this.rate)
        return CurrencyAmount.fromFractionalAmount(this.paymentToken, numerator, denominator)
      }
    }

    if (this.template === AuctionTemplate.DUTCH_AUCTION) {
      if (this.totalTokens && this.reservePrice) {
        const { denominator, numerator } = this.totalTokens.multiply(this.reservePrice)
        return CurrencyAmount.fromFractionalAmount(this.paymentToken, numerator, denominator)
      }
    }

    if (this.template === AuctionTemplate.BATCH_AUCTION) {
      if (this.auctionInfo.minimumCommitmentAmount) {
        return CurrencyAmount.fromRawAmount(this.paymentToken, JSBI.BigInt(this.auctionInfo.minimumCommitmentAmount))
      }
    }
  }

  public get minimumTargetRaised(): CurrencyAmount<Currency> | undefined {
    if (this.minimumPrice && this.totalTokens) {
      const { numerator, denominator } = this.minimumPrice.asFraction.multiply(this.totalTokens)
      return CurrencyAmount.fromFractionalAmount(this.paymentToken, numerator, denominator)
    }
  }

  public get maximumTargetRaised(): CurrencyAmount<Currency> | undefined {
    if (this.startPrice && this.totalTokens) {
      const { numerator, denominator } = this.startPrice.asFraction.multiply(this.totalTokens)
      return CurrencyAmount.fromFractionalAmount(this.paymentToken, numerator, denominator)
    }
  }

  public get remainingPercentage(): Percent | undefined {
    if (this.template === AuctionTemplate.BATCH_AUCTION) {
      return this.status === AuctionStatus.LIVE ? new Percent('100', '1') : undefined
    }

    if (this.template === AuctionTemplate.DUTCH_AUCTION && this.totalTokens && this.totalTokensCommitted) {
      const percent = new Percent(
        this.totalTokens.subtract(this.totalTokensCommitted).quotient,
        this.totalTokens.quotient
      )
      return percent.lessThan(percent) ? undefined : percent
    }

    if (this.template === AuctionTemplate.CROWDSALE && this.totalTokens && this.totalTokensCommitted) {
      return new Percent(this.totalTokens.subtract(this.totalTokensCommitted).quotient, this.totalTokens.quotient)
    }
  }

  public tokenAmount(amount: CurrencyAmount<Currency>): CurrencyAmount<Currency> | undefined {
    if (!this.currentPrice) return

    if (this.template === AuctionTemplate.BATCH_AUCTION) {
      if (this.currentPrice.equalTo(ZERO)) return this.totalTokens
    }

    return this.currentPrice.invert().quote(amount)
  }
}
