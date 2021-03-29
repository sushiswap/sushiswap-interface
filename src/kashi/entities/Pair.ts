import { ChainId, Token } from '@sushiswap/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { Oracle } from './Oracle'

export interface Rebase {
  base: BigNumber
  elastic: BigNumber
}

export interface AccrueInfo {
  interestPerSecond: BigNumber
  lastAccrued: BigNumber
  feesEarnedFraction: BigNumber
}

export interface KashiPollPair {
  address: string
  collateral: string
  asset: string
  oracle: string
  oracleData: string
  totalCollateralShare: BigNumber
  userCollateralShare: BigNumber
  totalAsset: Rebase
  userAssetFraction: BigNumber
  totalBorrow: Rebase
  userBorrowPart: BigNumber
  currentExchangeRate: BigNumber
  spotExchangeRate: BigNumber
  oracleExchangeRate: BigNumber
  accrueInfo: AccrueInfo
}

// class Value {
//   constructor(value) {
//     this.value = BigInt(value || 0n)
//   }

//   get str() {
//     if (this.value.print) {
//       return this.value.print(this.asset.decimals, 2)
//     }
//     console.warn('Cannot print value for Value')
//   }

//   get number() {
//     return this.value.toDec(this.asset.decimals)
//   }

//   get set() {
//     return this.value != 0n
//   }
// }

// class AssetValue extends Value {
//   constructor(value, asset) {
//     if (!asset) {
//       console.warn('Missing asset', value, asset)
//     }
//     super(value)
//     this.asset = asset
//   }
// }

// class AmountValue extends AssetValue {
//   get str() {
//     if (this.value.print) {
//       return this.value.print(this.asset.decimals, 2) + ' ' + this.asset.symbol
//     }
//     console.warn('Cannot print value for Amount')
//   }

//   get usd() {
//     return new USD(this.asset.rate > 0n ? (this.value * (app.ethRate || 0n)) / this.asset.rate : 0n)
//   }
// }

// class Current extends AmountValue {}

// class Amount extends AmountValue {
//   get str() {
//     if (this.value.print) {
//       return this.value.print(this.asset.decimals, 2) + ' ' + this.asset.symbol
//     }
//     console.warn('Cannot print value for Amount')
//   }

//   get amount() {
//     return this
//   }

//   get share() {
//     return new Share(
//       this.asset.bentoAmount ? (this.value * this.asset.bentoShare) / this.asset.bentoAmount : this.value,
//       this.asset
//     )
//   }
// }

// class Share extends AssetValue {
//   constructor(value, asset) {
//     if (value instanceof Value) {
//       if (value instanceof Share) {
//         value = value.value
//       } else {
//         console.warn('Wrong type, not Amount')
//       }
//     }
//     super(value, asset)
//   }

//   get str() {
//     if (this.value.print) {
//       return this.value.print(0, 0) + ' ' + this.asset.symbol + ' shares'
//     }
//     console.warn('Cannot print value for Share')
//   }

//   get amount() {
//     return new Amount(
//       this.asset.bentoShare ? (this.value * this.asset.bentoAmount) / this.asset.bentoShare : this.value,
//       this.asset
//     )
//   }

//   get share() {
//     return this
//   }

//   get usd() {
//     return this.amount.usd
//   }
// }

// class USD extends Value {
//   get str() {
//     if (this.value.print) {
//       return '$' + this.value.print(6, 2)
//     }
//     console.warn('Cannot print value for USD')
//   }
// }

// interface Pair {
//   address: string
//   collateral: Token
//   asset: Token
//   oracle: Oracle
//   oracleData: string
// }

// export interface Rebase {
//   //
// }

export interface KashiPair {
  address: string
  oracle: Oracle
  collateral: Token
  asset: Token
}

export class KashiPair implements KashiPair {
  constructor({ address, oracle, collateral, asset }: KashiPollPair) {
    this.address = address.toLowerCase()
    // this.oracle = oracle
    // this.oracle = new Oracle(oracle, oracleData)

    // this.collateral = collateral
    // this.asset = asset
  }
  // update(pair) {
  //   this.update_pair = pair
  //   if (!this.collateralFrom && this.collateral.bentoBalance) {
  //     this.collateralFrom = this.collateral.bentoBalance.set ? 'bento' : 'wallet'
  //   }
  //   if (!this.supplyFrom && this.asset.bentoBalance) {
  //     this.supplyFrom = this.asset.bentoBalance.set ? 'bento' : 'wallet'
  //   }
  //   Vue.set(this, 'totalCollateral', new Share(pair.totalCollateralShare, this.collateral))
  //   Vue.set(this, 'userCollateral', new Share(pair.userCollateralShare, this.collateral))
  //   Vue.set(this, 'totalAsset', new AssetRebase(pair.totalAsset, this))
  //   Vue.set(this, 'userAsset', new Fraction(pair.userAssetFraction, this))
  //   Vue.set(this, 'totalBorrow', new BorrowRebase(pair.totalBorrow, this))
  //   Vue.set(this, 'userBorrow', new Part(pair.userBorrowPart, this))
  //   Vue.set(this, 'currentExchangeRate', pair.currentExchangeRate)
  //   Vue.set(this, 'oracleExchangeRate', pair.oracleExchangeRate)
  //   Vue.set(this, 'accrueInfo', pair.accrueInfo)
  //   Vue.set(this, 'fee', new Fraction(this.accrueInfo.feesEarnedFraction, this))
  //   this.calculate()
  //   Vue.set(this, 'checked', true)
  //   return this
  // }
  // copy() {
  //   return new Pair(this.constructor_pair, this.web3).update(this.update_pair)
  // }
  // get search() {
  //   return (this.collateral.symbol + '/' + this.asset.symbol).toLowerCase()
  // }
  // get timeElapsed() {
  //   return app.timestamp - this.accrueInfo.lastAccrued
  // }
  // get fullAsset() {
  //   return new FullRebase(
  //     {
  //       elastic: this.totalAsset.amount.value + this.totalBorrow.current.value,
  //       base: this.totalAsset.fraction.value
  //     },
  //     this
  //   )
  // }
  // get interest() {
  //   return this.accrueInfo.interestPerSecond
  // }
  // get interestPerYear() {
  //   return this.accrueInfo.interestPerSecond * 60n * 60n * 24n * 365n
  // }
  // get utilization() {
  //   return this.totalBorrow.current.set
  //     ? (this.totalBorrow.current.value * 1000000000000000000n) / this.fullAsset.amount.value
  //     : 0n
  // }
  // get maxBorrowableOracle() {
  //   return this.oracleExchangeRate
  //     ? (((this.userCollateral.amount.value * 75n) / 100n) * 1000000000000000000n) / this.oracleExchangeRate
  //     : 0n
  // }
  // get maxBorrowableStored() {
  //   return this.currentExchangeRate
  //     ? (((this.userCollateral.amount.value * 75n) / 100n) * 1000000000000000000n) / this.currentExchangeRate
  //     : 0n
  // }
  // get maxBorrowable() {
  //   return BigInt.min(this.maxBorrowableOracle, this.maxBorrowableStored)
  // }
  // get safeMaxBorrowable() {
  //   return (this.maxBorrowable * 95n * 10000n) / 100n / 10005n
  // }
  // get safeMaxBorrowableLeft() {
  //   return this.safeMaxBorrowable - this.userBorrow.current.value
  // }
  // get safeMaxBorrowableLeftPossible() {
  //   return BigInt.min(this.safeMaxBorrowable - this.userBorrow.current.value, this.totalBorrowable.amount.value)
  // }
  // get pairHealth() {
  //   return this.maxBorrowable ? (this.userBorrow.current.value * 1000000000000000000n) / this.maxBorrowable : 0n
  // }
  // calculate() {
  //   Vue.set(
  //     this,
  //     'totalBorrowable',
  //     new Share(this.totalAsset.elastic > 1000n ? this.totalAsset.elastic - 1000n : 0n, this.asset)
  //   )
  //   Vue.set(this, 'currentInterest', this.interestAccrue(this.interest) * 60n * 60n * 24n * 365n)
  //   Vue.set(this, 'supplyAPR', takeFee(this.interestPerYear * this.utilization) / 1000000000000000000n)
  //   Vue.set(this, 'currentSupplyAPR', takeFee(this.currentInterest * this.utilization) / 1000000000000000000n)
  //   Vue.set(
  //     this,
  //     'healthPercentage',
  //     this.maxBorrowable ? (this.userBorrow.current.value * 1000000000000000000n) / this.maxBorrowable : 0n
  //   )
  //   Vue.set(
  //     this,
  //     'health',
  //     this.userBorrow.current.value ? (this.maxBorrowable * 1000000000000000000n) / this.userBorrow.current.value : 0n
  //   )
  // }
  // accrue(amount) {
  //   return (amount * this.accrueInfo.interestPerSecond * this.timeElapsed) / 1000000000000000000n
  // }
  // interestAccrue(interest_per_second) {
  //   if (!this.totalBorrow.base) {
  //     return this.STARTING_INTEREST_PER_SECOND
  //   }
  //   let newInterest = interest_per_second
  //   if (this.timeElapsed <= 0) {
  //     return newInterest
  //   }
  //   if (this.utilization < this.MINIMUM_TARGET_UTILIZATION) {
  //     const underFactor =
  //       ((this.MINIMUM_TARGET_UTILIZATION - this.utilization) * this.FACTOR_PRECISION) / this.MINIMUM_TARGET_UTILIZATION
  //     const scale = this.INTEREST_ELASTICITY + underFactor * underFactor * this.timeElapsed
  //     newInterest = (newInterest * this.INTEREST_ELASTICITY) / scale
  //     if (newInterest < this.MINIMUM_INTEREST_PER_SECOND) {
  //       newInterest = this.MINIMUM_INTEREST_PER_SECOND // 0.25% APR minimum
  //     }
  //   } else if (this.utilization > this.MAXIMUM_TARGET_UTILIZATION) {
  //     const overFactor =
  //       ((this.utilization - this.MAXIMUM_TARGET_UTILIZATION) * this.FACTOR_PRECISION) / this.FULL_UTILIZATION_MINUS_MAX
  //     const scale = this.INTEREST_ELASTICITY + overFactor * overFactor * this.timeElapsed
  //     newInterest = (newInterest * scale) / this.INTEREST_ELASTICITY
  //     if (newInterest > this.MAXIMUM_INTEREST_PER_SECOND) {
  //       newInterest = this.MAXIMUM_INTEREST_PER_SECOND // 1000% APR maximum
  //     }
  //   }
  //   return newInterest
  // }
}

// class PairValue extends Value {
//   constructor(value, pair) {
//     if (!pair) {
//       console.warn('Missing pair')
//     }
//     super(value)
//     this.pair = pair
//   }

//   get share() {
//     return this.amount.share
//   }

//   get usd() {
//     return this.amount.usd
//   }
// }

// class Part extends PairValue {
//   get str() {
//     if (this.value.print) {
//       return this.value.print(0, 0) + ' ' + this.asset.symbol + ' parts'
//     }
//     console.warn('Cannot print value for Part', this.pair)
//   }

//   get amount() {
//     return new BorrowAmount(
//       this.pair.totalBorrow.base
//         ? (this.value * this.pair.totalBorrow.elastic) / this.pair.totalBorrow.base
//         : this.value,
//       this.pair
//     )
//   }

//   get part() {
//     return this
//   }

//   get current() {
//     return this.amount.current
//   }
// }

// class BorrowAmount extends PairValue {
//   get str() {
//     return this.amount.str
//   }

//   get amount() {
//     return new Amount(this.value, this.pair.asset)
//   }

//   get part() {
//     return new Part(
//       this.pair.totalBorrow.elastic
//         ? (this.value * this.pair.totalBorrow.base) / this.pair.totalBorrow.elastic
//         : this.value,
//       this.pair
//     )
//   }

//   get current() {
//     return new Amount(this.value + takeFee(this.pair.accrue(this.value)), this.pair.asset)
//   }

//   get accrued() {
//     return new Amount(takeFee(this.pair.accrue(this.value)), this.pair.asset)
//   }
// }

// class Fraction extends PairValue {
//   get str() {
//     if (this.value.print) {
//       return this.value.print(0, 0) + ' ' + this.pair.asset.symbol + ' fractions'
//     }
//     console.warn('Cannot print value for Fraction', this.pair)
//   }

//   get amount() {
//     return this.share.amount
//   }

//   get fraction() {
//     return this
//   }

//   get full() {
//     return new Amount(this.pair.fullAsset.toElastic(this.value), this.pair.asset)
//   }

//   get share() {
//     return new AssetShare(this.pair.totalAsset.toElastic(this.value), this.pair)
//   }

//   get usd() {
//     return this.amount.usd
//   }
// }

// class AssetShare extends PairValue {
//   get str() {
//     if (this.value.print) {
//       return this.value.print(0, 0) + ' ' + this.pair.asset.symbol + ' shares'
//     }
//     console.warn('Cannot print value for shares', this.pair)
//   }

//   get amount() {
//     return new AssetAmount(new Share(this.value, this.pair.asset).amount.value, this.pair)
//   }

//   get share() {
//     return this
//   }

//   get usd() {
//     return this.amount.usd
//   }
// }

// class AssetAmount extends Amount {
//   constructor(value, pair) {
//     super(value, pair.asset)
//     this.pair = pair
//   }

//   get current() {
//     return this.value + pair.accrue(this.value)
//   }
// }

// class Rebase {
//   constructor(rebase, pair) {
//     this.base = rebase.base
//     this.elastic = rebase.elastic
//     this.pair = pair
//   }

//   toElastic(base) {
//     return rebase(base, this.base, this.elastic)
//   }

//   toBase(elastic) {
//     return rebase(elastic, this.elastic, this.base)
//   }
// }

// class AssetRebase extends Rebase {
//   get fraction() {
//     return new Fraction(this.base, this.pair)
//   }

//   get amount() {
//     return this.share.amount
//   }

//   get share() {
//     return new AssetShare(this.elastic, this.pair)
//   }
// }

// class FullRebase extends Rebase {
//   get fraction() {
//     return new Fraction(this.base, this.pair)
//   }

//   get amount() {
//     return new Amount(this.elastic, this.pair.asset)
//   }
// }

// class BorrowRebase extends Rebase {
//   get part() {
//     return new Part(this.base, this.pair)
//   }

//   get amount() {
//     return new BorrowAmount(this.elastic, this.pair)
//   }

//   get current() {
//     return this.amount.current
//   }
// }

// const chainlinkTokens = [
//   '0x111111111117dc0aa78b770fa6a738034120c302',
//   '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
//   '0xade00c28244d5ce17d72e40330b1c318cd12b7c3',
//   '0xa1faa113cbe53436df28ff0aee54275c13b40975',
//   '0xff20817765cb7f73d4bde2e66e067e58d11095c2',
//   '0xa117000000f279d81a1d3cc75430faa017fa5a2e',
//   '0x3472a5a71965499acd81997a54bba8d852c6e53d',
//   '0xba100000625a3754423978a60c9317c58a424e3d',
//   '0xba11d00c5f74255f56a5e366f4f77f5a186d7f55',
//   '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
//   '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
//   '0x4fabb145d64652a948d72533023f6e7a623c7c53',
//   '0x56d811088235f11c8920698a204a5010a788f4b3',
//   '0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d',
//   '0xc00e94cb662c3520282e6f5717214004a7f26888',
//   '0x4688a8b1f292fdab17e9a90c8bc379dc1dbd8713',
//   '0x2ba592f78db6436527729929aaf6c908497cb200',
//   '0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b',
//   '0xd533a949740bb3306d119cc777fa900ba034cd52',
//   '0x6b175474e89094c44da98b954eedeac495271d0f',
//   '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b',
//   '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
//   '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//   '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
//   '0x50d1c9771902476076ecfc8b2a83ad6b9355a4c9',
//   '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
//   '0x584bc13c7d411c00c01a62e8019472de68768430',
//   '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
//   '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
//   '0x1ceb5cb57c4d4e2b2433641b95dd330a33185a44',
//   '0x514910771af9ca656af840dff83e8264ecf986ca',
//   '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd',
//   '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
//   '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
//   '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
//   '0xec67005c4e498ec7f55e092bd1d35cbc47c91892',
//   '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2',
//   '0x1776e1f26f98b1a5df9cd347953a26dd3cb46671',
//   '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26',
//   '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
//   '0x4575f41308ec1483f3d399aa9a2826d74da13deb',
//   '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
//   '0x45804880de22913dafe09f4980848ece6ecbaf78',
//   '0xbc396689893d065f41bc2c6ecbee5e0085233447',
//   '0xf970b8e36e23f7fc3fd752eea86f8be8d83375a6',
//   '0x408e41876cccdc0f92210600ef50372656052a38',
//   '0x221657776846890989a759ba2973e427dff5c9bb',
//   '0x607f4c5bb672230e8672085532f7e901544a7375',
//   '0x3155ba85d5f96b2d030a4966af206230e46849cb',
//   '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
//   '0x476c5e26a75bd202a9683ffd34359c0cc15be0ff',
//   '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
//   '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
//   '0x8ce9137d39326ad0cd6491fb5cc0cba0e089b6a9',
//   '0x05d3606d5c81eb9b7b18530995ec9b29da05faba',
//   '0x4c19596f5aaff459fa38b0f7ed92f11ae6543784',
//   '0x0000000000085d4780b73119b644ae5ecd22b376',
//   '0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
//   '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
//   '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
//   '0xdac17f958d2ee523a2206206994597c13d831ec7',
//   '0xa47c8bf37f92abed4a126bda807a7b7498661acd',
//   '0x1cf4592ebffd730c7dc92c1bdffdfc3b9efcf29a',
//   '0x0d438f3b5175bebc262bf23753c1e53d03432bde',
//   '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
//   '0xa1d0e215a23d7030842fc67ce582a6afa3ccab83',
//   '0xe41d2489571d322189246dafa5ebde1f4699f498'
// ]

// const ChainlinkMapping = {
//   '0x72AFAECF99C9d9C8215fF44C77B94B99C28741e8': {
//     from: '0x111111111117dc0aa78b770fa6a738034120c302',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x6Df09E975c830ECae5bd4eD9d90f3A95a4f88012': {
//     from: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x547a514d5e3769680Ce22B2361c10Ea13619e8a9': {
//     from: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   //"0xAE48c91dF1fE419994FFDa27da09D5aC69c30f55": { "from": "0xe36e2d3c7c34281fa3bc737950a68571736880a1", "to": "0x0000000000000000000000000000000000000001", decimals: 8n, "warning": "For the price of sADA, the Chainlink oracle for ADA is used.  " },
//   '0x231e764B44b2C1b7Ca171fa8021A24ed520Cde10': {
//     from: '0xade00c28244d5ce17d72e40330b1c318cd12b7c3',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   '0x89c7926c7c15fD5BFDB1edcFf7E7fC8283B578F6': {
//     from: '0xa1faa113cbe53436df28ff0aee54275c13b40975',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x8797ABc4641dE76342b8acE9C63e3301DC35e3d8': {
//     from: '0xff20817765cb7f73d4bde2e66e067e58d11095c2',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   //"0x492575FDD11a0fCf2C6C719867890a7648d526eB": { "from": "0xd46ba6d942050d489dbd938a2c909a5d5039a161", "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", decimals: 18n },
//   //"0xe20CA8D7546932360e37E9D72c1a47334af57706": { "from": "0xd46ba6d942050d489dbd938a2c909a5d5039a161", "to": "0x0000000000000000000000000000000000000001", decimals: 18n },
//   '0x8f83670260F8f7708143b836a2a6F11eF0aBac01': {
//     from: '0xa117000000f279d81a1d3cc75430faa017fa5a2e',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   //"0x77F9710E7d0A19669A13c055F62cd80d313dF022": { "from": "0xf48e200eaf9906362bb1442fca31e0835773b8b4", "to": "0x0000000000000000000000000000000000000001", decimals: 8n, "warning": "For the price of sAUD, the Chainlink oracle for AUD is used.  " },
//   '0x58921Ac140522867bf50b9E009599Da0CA4A2379': {
//     from: '0x3472a5a71965499acd81997a54bba8d852c6e53d',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xC1438AA3823A6Ba0C159CfA8D98dF5A994bA120b': {
//     from: '0xba100000625a3754423978a60c9317c58a424e3d',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x0BDb051e10c9718d1C29efbad442E88D38958274': {
//     from: '0xba11d00c5f74255f56a5e366f4f77f5a186d7f55',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x919C77ACc7373D000b329c1276C76586ed2Dd19F': {
//     from: '0xba11d00c5f74255f56a5e366f4f77f5a186d7f55',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   '0x0d16d4528239e9ee52fa531af613AcdB23D88c94': {
//     from: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   //"0x9F0F69428F923D6c95B781F89E165C9b2df9789D": { "from": "0x36a2422a863d5b950882190ff5433e513413343a", "to": "0x0000000000000000000000000000000000000001", decimals: 8n, "warning": "For the price of sBCH, the Chainlink oracle for BCH is used.  " },
//   //"0xc546d2d06144F9DD42815b8bA46Ee7B8FcAFa4a2": { "from": "0x617aecb6137b5108d1e7d4918e3725c8cebdb848", "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", decimals: 18n, "warning": "For the price of sBNB, the Chainlink oracle for BNB is used.  " },
//   //"0x14e613AC84a31f709eadbdF89C6CC390fDc9540A": { "from": "0x617aecb6137b5108d1e7d4918e3725c8cebdb848", "to": "0x0000000000000000000000000000000000000001", decimals: 8n, "warning": "For the price of sBNB, the Chainlink oracle for BNB is used.  " },
//   //"0xCf61d1841B178fe82C8895fe60c2EDDa08314416": { "from": "0xb1cd6e4153b2a390cf00a6556b0fc1458c4a5533", "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", decimals: 18n },
//   //"0x1E6cF0D433de4FE882A437ABC654F58E1e78548c": { "from": "0xb1cd6e4153b2a390cf00a6556b0fc1458c4a5533", "to": "0x0000000000000000000000000000000000000001", decimals: 8n },
//   '0xdeb288F737066589598e9214E782fa5A8eD689e8': {
//     from: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n,
//     warning: 'For the price of WBTC, the Chainlink oracle for BTC is used.  '
//   },
//   '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c': {
//     from: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n,
//     warning: 'For the price of WBTC, the Chainlink oracle for BTC is used.  '
//   },
//   '0x614715d2Af89E6EC99A233818275142cE88d1Cfd': {
//     from: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x8f7C7181Ed1a2BA41cfC3f5d064eF91b67daef66': {
//     from: '0x56d811088235f11c8920698a204a5010a788f4b3',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   //"0xa34317DB73e77d453b1B8d04550c44D10e981C8e": { "from": "0x2029017f38128bfefaa6c7b9cdd1b680ce8e5c03", "to": "0x0000000000000000000000000000000000000001", decimals: 8n },
//   '0x75FbD83b4bd51dEe765b2a01e8D3aa1B020F9d33': {
//     from: '0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   //"0x449d117117838fFA61263B61dA6301AA2a88B13A": { "from": "0x0f83287ff768d1c1e17a42f44d644d7f22e8ee1d", "to": "0x0000000000000000000000000000000000000001", decimals: 8n, "warning": "For the price of sCHF, the Chainlink oracle for CHF is used.  " },
//   '0x1B39Ee86Ec5979ba5C322b826B3ECb8C79991699': {
//     from: '0xc00e94cb662c3520282e6f5717214004a7f26888',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xdbd020CAeF83eFd542f4De03e3cF0C28A4428bd5': {
//     from: '0xc00e94cb662c3520282e6f5717214004a7f26888',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   '0x7B6230EF79D5E97C11049ab362c0b685faCBA0C2': {
//     from: '0x4688a8b1f292fdab17e9a90c8bc379dc1dbd8713',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x0ad50393F11FfAc4dd0fe5F1056448ecb75226Cf': {
//     from: '0x4688a8b1f292fdab17e9a90c8bc379dc1dbd8713',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   '0x82597CFE6af8baad7c0d441AA82cbC3b51759607': {
//     from: '0x2ba592f78db6436527729929aaf6c908497cb200',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xcA696a9Eb93b81ADFE6435759A29aB4cf2991A96': {
//     from: '0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x8a12Be339B0cD1829b91Adc01977caa5E9ac121e': {
//     from: '0xd533a949740bb3306d119cc777fa900ba034cd52',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x773616E4d11A78F511299002da57A0a94577F1f4': {
//     from: '0x6b175474e89094c44da98b954eedeac495271d0f',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9': {
//     from: '0x6b175474e89094c44da98b954eedeac495271d0f',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   //"0xFb0cADFEa136E9E343cfb55B863a6Df8348ab912": { "from": "0xfe33ae95a9f0da8a845af33516edc240dcd711d6", "to": "0x0000000000000000000000000000000000000001", decimals: 8n, "warning": "For the price of sDASH, the Chainlink oracle for DASH is used.  " },
//   //"0x418a6C98CD5B8275955f08F0b8C1c6838c8b1685": { "from": "0x798d1be841a82a273720ce31c822c61a67a601c3", "to": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", decimals: 8n },
//   //"0xD010e899f7ab723AC93f825cDC5Aa057669557c2": { "from": "0xed91879919b71bb6905f23af0a68d231ecf87b14", "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", decimals: 18n },
//   //"0x1C07AFb8E2B827c5A4739C6d59Ae3A5035f28734": { "from": "0x1715ac0743102bf5cd58efbb6cf2dc2685d967b6", "to": "0x0000000000000000000000000000000000000001", decimals: 8n },
//   '0x029849bbc0b1d93b85a8b6190e979fd38F5760E2': {
//     from: '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xD2A593BF7594aCE1faD597adb697b5645d5edDB2': {
//     from: '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 18n
//   },
//   '0x24D9aB51950F3d62E9144fdC2f3135DAA6Ce8D1B': {
//     from: '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   //"0x10a43289895eAff840E8d45995BBa89f9115ECEe": { "from": "0x88c8cf3a212c0369698d13fe98fcb76620389841", "to": "0x0000000000000000000000000000000000000001", decimals: 8n },
//   '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419': {
//     from: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   //"0xb49f677943BC038e9857d61E7d053CaA2C1734C1": { "from": "0xd71ecff9342a5ced620049e616c5035f1db98620", "to": "0x0000000000000000000000000000000000000001", decimals: 8n },
//   //"0x0606Be69451B1C9861Ac6b3626b99093b713E801": { "from": "0x6e1a19f235be7ed8e3369ef73b196c07257494de", "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", decimals: 18n },
//   //"0x1A31D42149e82Eb99777f903C08A2E41A00085d3": { "from": "0x6e1a19f235be7ed8e3369ef73b196c07257494de", "to": "0x0000000000000000000000000000000000000001", decimals: 8n },
//   //"0x80070f7151BdDbbB1361937ad4839317af99AE6c": { "from": "0xef9cd7882c067686691b6ff49e650b43afbbcc6b", "to": "0x0000000000000000000000000000000000000001", decimals: 8n },
//   '0x2DE7E4a9488488e0058B95854CC2f7955B35dC9b': {
//     from: '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xF0985f7E2CaBFf22CecC5a71282a89582c382EFE': {
//     from: '0x50d1c9771902476076ecfc8b2a83ad6b9355a4c9',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   //"0x5c0Ab2d9b5a7ed9f470386e82BB36A3613cDd4b5": { "from": "0x97fe22e7341a0cd8db6f6c021a24dc8f4dad855f", "to": "0x0000000000000000000000000000000000000001", decimals: 8n },
//   '0x17D054eCac33D91F7340645341eFB5DE9009F1C1': {
//     from: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xAf5E8D9Cd9fC85725A83BF23C52f1C39A71588a6': {
//     from: '0x584bc13c7d411c00c01a62e8019472de68768430',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xBFC189aC214E6A4a35EBC281ad15669619b75534': {
//     from: '0x584bc13c7d411c00c01a62e8019472de68768430',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   '0xaE2EbE3c4D20cE13cE47cbb49b6d7ee631Cd816e': {
//     from: '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   //"0xd0935838935349401c73a06FCde9d63f719e84E5": { "from": "0xfa1a856cfa3409cfa145fa4e20eb270df3eb21ab", "to": "0x0000000000000000000000000000000000000001", decimals: 8n },
//   //"0xBcE206caE7f0ec07b545EddE332A47C2F75bbeb3": { "from": "0xf6b1c627e95bfc3c1b4c9b825a032ff0fbf3e07d", "to": "0x0000000000000000000000000000000000000001", decimals: 8n, "warning": "For the price of sJPY, the Chainlink oracle for JPY is used.  " },
//   '0x656c0544eF4C98A6a98491833A89204Abb045d6b': {
//     from: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xf8fF43E991A81e6eC886a3D281A2C6cC19aE70Fc': {
//     from: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   '0xe7015CCb7E5F788B8c1010FC22343473EaaC3741': {
//     from: '0x1ceb5cb57c4d4e2b2433641b95dd330a33185a44',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xDC530D9457755926550b59e8ECcdaE7624181557': {
//     from: '0x514910771af9ca656af840dff83e8264ecf986ca',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c': {
//     from: '0x514910771af9ca656af840dff83e8264ecf986ca',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   '0x160AC928A16C93eD4895C2De6f81ECcE9a7eB7b4': {
//     from: '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xFd33ec6ABAa1Bdc3D9C6C85f1D6299e5a1a5511F': {
//     from: '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   //"0x6AF09DF7563C363B5763b9102712EbeD3b9e859B": { "from": "0xc14103c2141e842e228fbac594579e798616ce7a", "to": "0x0000000000000000000000000000000000000001", decimals: 8n, "warning": "For the price of sLTC, the Chainlink oracle for LTC is used.  " },
//   '0x82A44D92D6c329826dc557c5E1Be6ebeC5D5FeB9': {
//     from: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676': {
//     from: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   '0x24551a8Fb2A7211A25a17B1481f043A8a8adC7f2': {
//     from: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xDaeA8386611A157B08829ED4997A8A62B557014C': {
//     from: '0xec67005c4e498ec7f55e092bd1d35cbc47c91892',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x98334b85De2A8b998Ba844c5521e73D68AD69C00': {
//     from: '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xc751E86208F0F8aF2d5CD0e29716cA7AD98B5eF5': {
//     from: '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   '0x9cB2A01A7E64992d32A34db7cEea4c919C391f6A': {
//     from: '0x1776e1f26f98b1a5df9cd347953a26dd3cb46671',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x2c881B6f3f6B5ff6C975813F87A4dad0b241C15b': {
//     from: '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x57C9aB3e56EE4a83752c181f241120a3DBba06a1': {
//     from: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xd75AAaE4AF0c398ca13e2667Be57AF2ccA8B5de6': {
//     from: '0x4575f41308ec1483f3d399aa9a2826d74da13deb',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   '0x3a08ebBaB125224b7b6474384Ee39fBb247D2200': {
//     from: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x9B97304EA12EFed0FAd976FBeCAad46016bf269e': {
//     from: '0x45804880de22913dafe09f4980848ece6ecbaf78',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x3b41D5571468904D4e53b6a8d93A6BaC43f02dC9': {
//     from: '0xbc396689893d065f41bc2c6ecbee5e0085233447',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xEa0b3DCa635f4a4E77D9654C5c18836EE771566e': {
//     from: '0xf970b8e36e23f7fc3fd752eea86f8be8d83375a6',
//     to: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
//     decimals: 8n
//   },
//   '0x3147D7203354Dc06D9fd350c7a2437bcA92387a4': {
//     from: '0x408e41876cccdc0f92210600ef50372656052a38',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x0f59666EDE214281e956cb3b2D0d69415AfF4A01': {
//     from: '0x408e41876cccdc0f92210600ef50372656052a38',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   '0xD4CE430C3b67b3E2F7026D86E7128588629e2455': {
//     from: '0x221657776846890989a759ba2973e427dff5c9bb',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x4cba1e1fdc738D0fe8DB3ee07728E2Bc4DA676c6': {
//     from: '0x607f4c5bb672230e8672085532f7e901544a7375',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x875D60C44cfbC38BaA4Eb2dDB76A767dEB91b97e': {
//     from: '0x3155ba85d5f96b2d030a4966af206230e46849cb',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x79291A9d692Df95334B1a0B3B4AE6bC606782f8c': {
//     from: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xDC3EA94CD0AC27d9A86C180091e7f78C683d3699': {
//     from: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   '0x050c048c9a0CD0e76f166E2539F87ef2acCEC58f': {
//     from: '0x476c5e26a75bd202a9683ffd34359c0cc15be0ff',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x8e0b7e6062272B5eF4524250bFFF8e5Bd3497757': {
//     from: '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xe572CeF69f43c2E488b33924AF04BDacE19079cf': {
//     from: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xFb0CfD6c19e25DB4a08D8a204a387cEa48Cc138f': {
//     from: '0x8ce9137d39326ad0cd6491fb5cc0cba0e089b6a9',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   '0x3d44925a8E9F9DFd90390E58e92Ec16c996A331b': {
//     from: '0x05d3606d5c81eb9b7b18530995ec9b29da05faba',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n,
//     warning: 'For the price of TOMOE, the Chainlink oracle for TOMO is used. '
//   },
//   '0x26929b85fE284EeAB939831002e1928183a10fb1': {
//     from: '0x4c19596f5aaff459fa38b0f7ed92f11ae6543784',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   //"0xacD0D1A29759CC01E8D925371B72cb2b5610EA25": { "from": "0xf2e08356588ec5cd9e437552da87c0076b4970b0", "to": "0x0000000000000000000000000000000000000001", decimals: 8n, "warning": "For the price of sTRX, the Chainlink oracle for TRX is used " },
//   //"0x1ceDaaB50936881B3e449e47e40A2cDAF5576A4a": { "from": "0x918da91ccbc32b7a6a0cc4ecd5987bbab6e31e6d", "to": "0x0000000000000000000000000000000000000001", decimals: 8n, "warning": "For the price of sTSLA, the Chainlink oracle for TSLA is used. " },
//   '0x3886BA987236181D98F2401c507Fb8BeA7871dF2': {
//     from: '0x0000000000085d4780b73119b644ae5ecd22b376',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xf817B69EA583CAFF291E287CaE00Ea329d22765C': {
//     from: '0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xD6aA3D25116d8dA79Ea0246c4826EB951872e02e': {
//     from: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x553303d460EE0afB37EdFf9bE42922D8FF63220e': {
//     from: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   '0x986b5E1e1755e3C2440e960477f25201B0a8bbD4': {
//     from: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6': {
//     from: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   //"0xfAC81Ea9Dd29D8E9b212acd6edBEb6dE38Cb43Af": { "from": "0x1c48f86ae57291f7686349f12601910bd8d470bb", "to": "0x0000000000000000000000000000000000000001", decimals: 8n },
//   '0xEe9F2375b4bdF6387aa8265dD4FB8F16512A1d46': {
//     from: '0xdac17f958d2ee523a2206206994597c13d831ec7',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D': {
//     from: '0xdac17f958d2ee523a2206206994597c13d831ec7',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   '0xa20623070413d42a5C01Db2c8111640DD7A5A03a': {
//     from: '0xa47c8bf37f92abed4a126bda807a7b7498661acd',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x9a79fdCd0E326dF6Fa34EA13c05d3106610798E9': {
//     from: '0x1cf4592ebffd730c7dc92c1bdffdfc3b9efcf29a',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   '0xe5Dc0A609Ab8bCF15d3f35cFaa1Ff40f521173Ea': {
//     from: '0x0d438f3b5175bebc262bf23753c1e53d03432bde',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   //"0xcEBD2026d3C99F2a7CE028acf372C154aB4638a9": { "from": "0xbd356a39bff2cada8e9248532dd879147221cf76", "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", decimals: 18n },
//   //"0xf3584F4dd3b467e73C2339EfD008665a70A4185c": { "from": "0x6d16cf3ec5f763d4d99cb0b0b110eefd93b11b56", "to": "0x0000000000000000000000000000000000000001", decimals: 8n, "warning": "For the price of sOIL, the Chainlink oracle for WTI is used.  " },
//   //"0x379589227b15F1a12195D3f2d90bBc9F31f95235": { "from": "0x6a22e5e94388464181578aa7a6b869e00fe27846", "to": "0x0000000000000000000000000000000000000001", decimals: 8n, "warning": "For the price of sXAG, the Chainlink oracle for XAG is used.  " },
//   //"0x214eD9Da11D2fbe465a6fc601a91E62EbEc1a0D6": { "from": "0x261efcdd24cea98652b9700800a13dfbca4103ff", "to": "0x0000000000000000000000000000000000000001", decimals: 8n, "warning": "For the price of sXAU, the Chainlink oracle for XAU is used.  " },
//   //"0xFA66458Cce7Dd15D8650015c4fce4D278271618F": { "from": "0x465e07d6028830124be2e4aa551fbe12805db0f5", "to": "0x0000000000000000000000000000000000000001", decimals: 8n, "warning": "For the price of WXMR, the Chainlink oracle for WXMR is used.  " },
//   //"0xCed2660c6Dd1Ffd856A5A82C67f3482d88C50b12": { "from": "0xa2b0fde6d710e201d0d608e924a484d1a5fed57c", "to": "0x0000000000000000000000000000000000000001", decimals: 8n, "warning": "For the price of sXRP, the Chainlink oracle for XRP is used.  " },
//   //"0x5239a625dEb44bF3EeAc2CD5366ba24b8e9DB63F": { "from": "0x2e59005c5c0f0a4d77cca82653d48b46322ee5cd", "to": "0x0000000000000000000000000000000000000001", decimals: 8n, "warning": "For the price of sXTZ, the Chainlink oracle for XTZ is used.  " },
//   '0x7c5d4F8345e66f68099581Db340cd65B078C41f4': {
//     from: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0xA027702dbb89fbd58938e4324ac03B58d812b0E1': {
//     from: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   },
//   '0xaaB2f6b45B28E962B3aCd1ee4fC88aEdDf557756': {
//     from: '0xa1d0E215a23d7030842FC67cE582a6aFa3CCaB83',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x2Da4983a622a8498bb1a21FaE9D8F6C664939962': {
//     from: '0xe41d2489571d322189246dafa5ebde1f4699f498',
//     to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18n
//   },
//   '0x2885d15b8Af22648b98B122b22FDF4D2a56c6023': {
//     from: '0xe41d2489571d322189246dafa5ebde1f4699f498',
//     to: '0x0000000000000000000000000000000000000001',
//     decimals: 8n
//   }
//   //"0x283D433435cFCAbf00263beEF6A362b7cc5ed9f2": { "from": "0xeabacd844a196d7faf3ce596edebf9900341b420", "to": "0x0000000000000000000000000000000000000001", decimals: 8n },
//   //"0xa8E875F94138B0C5b51d1e1d5dE35bbDdd28EA87": { "from": "0xe1afe1fd76fd88f78cbf599ea1846231b8ba3b6b", "to": "0x0000000000000000000000000000000000000001", decimals: 8n },
// }
