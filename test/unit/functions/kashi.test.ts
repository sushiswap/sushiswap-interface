import 'app/bootstrap'

import { BigNumber } from '@ethersproject/bignumber'
import {
  MAXIMUM_INTEREST_PER_YEAR,
  MAXIMUM_TARGET_UTILIZATION,
  MINIMUM_INTEREST_PER_YEAR,
  MINIMUM_TARGET_UTILIZATION,
  STARTING_INTEREST_PER_YEAR,
} from '@sushiswap/sdk'
import {
  accrue,
  accrueTotalAssetWithFee,
  addBorrowFee,
  e10,
  easyAmount,
  getFraction,
  getUSDString,
  getUSDValue,
  interestAccrue,
  takeFee,
  ZERO,
} from 'app/functions'

describe('kashi functions', () => {
  const pair = {
    asset: {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      isNative: false,
      isToken: true,
      list: {
        name: 'SushiSwap Menu',
        timestamp: '2021-09-08T01:59:50.068Z',
        version: {
          major: 15,
          minor: 4,
          patch: 0,
        },
        tags: {},
        logoURI: 'https://raw.githubusercontent.com/sushiswap/art/master/sushi/logo-256x256.png',
        keywords: ['sushiswap', 'default'],
      },
      tokenInfo: {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        chainId: 1,
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
        logoURI: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/usdt.jpg',
      },
      _checksummedAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      _tags: null,
      token: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      totalSupply: BigNumber.from('33861598607967472'),
      balance: ZERO,
      bentoBalance: ZERO,
      bentoAllowance: ZERO,
      nonce: BigNumber.from('115792089237316195423570985008687907853269984665640564039457584007913129639935'),
      bentoAmount: BigNumber.from('825093595989'),
      bentoShare: BigNumber.from('825093595989'),
      elastic: BigNumber.from('825093595989'),
      share: BigNumber.from('825093595989'),
      rate: BigNumber.from('3424289984'),
      symbol: 'USDT',
      usd: BigNumber.from('1000000'),
    },
    oracle: '0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB',
    oracleData:
      '0x000000000000000000000000ee9f2375b4bdf6387aa8265dd4fb8f16512a1d46000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d3c21bcecceda1000000',
    totalCollateralShare: BigNumber.from('106314560336092751303'),
    userCollateralShare: ZERO,
    totalAsset: {
      elastic: BigNumber.from('182890061742'),
      base: BigNumber.from('341815798040'),
    },
    userAssetFraction: ZERO,
    totalBorrow: {
      elastic: BigNumber.from('167400542083'),
      base: BigNumber.from('160909456471'),
    },
    userBorrowPart: ZERO,
    currenwchangeRate: BigNumber.from('257113025824117000000000000'),
    spotExchangeRate: BigNumber.from('294003066704928000000000000'),
    oracleExchangeRate: BigNumber.from('294003066704928000000000000'),
    accrueInfo: {
      interestPerSecond: BigNumber.from('1630032262'),
      lastAccrued: BigNumber.from('1631690670'),
      feesEarnedFraction: BigNumber.from('8394132'),
    },
    address: '0xfF7D29c7277D8A8850c473f0b71d7e5c4Af45A50',
    elapsedSeconds: BigNumber.from('19190'),
    interestPerYear: BigNumber.from('51404697414432000'),
    totalCollateralAmount: {
      value: BigNumber.from('106314560336092751303'),
      string: '106.31456033',
      usdValue: BigNumber.from('364051884112'),
      usd: '364051.884112',
    },
    totalAssetAmount: {
      value: BigNumber.from('182890061742'),
      string: '182890.061742',
      usdValue: BigNumber.from('182890061742'),
      usd: '182890.061742',
    },
    currentBorrowAmount: {
      value: BigNumber.from('167405778425'),
      string: '167405.778425',
      usdValue: BigNumber.from('167405778425'),
      usd: '167405.778425',
    },
    currentAllAssets: {
      value: BigNumber.from('350295840167'),
      string: '350295.840167',
      usdValue: BigNumber.from('350295840167'),
      usd: '350295.840167',
    },
    utilization: BigNumber.from('477898276911284438'),
  }

  describe('accrue', () => {
    it('includes principal', () => {
      const res = accrue(pair, pair.totalBorrow.elastic, true)

      expect(res.toString()).toEqual('167405778425')
    })

    it('does not include principal', () => {
      const res = accrue(pair, pair.totalBorrow.elastic)

      expect(res.toString()).toEqual('5236342')
    })
  })

  describe('accrueTotalAssetWithFee', () => {
    it('returns data', () => {
      const res = accrueTotalAssetWithFee(pair)

      expect(res).toEqual({
        elastic: pair.totalAsset.elastic,
        base: BigNumber.from('0x4f95d86b73'),
      })
    })
  })

  describe('interestAccrue', () => {
    it('returns starting interest if totalBorrow is 0', () => {
      const pairInput = {
        totalBorrow: { base: ZERO },
      }

      const res = interestAccrue(pairInput, ZERO)

      expect(res.eq(STARTING_INTEREST_PER_YEAR)).toBeTruthy()
    })

    it('returns interest if elapseSeconds is 0', () => {
      const pairInput = {
        ...pair,
        elapsedSeconds: ZERO,
      }

      const res = interestAccrue(pairInput, ZERO)

      expect(res.eq(ZERO)).toBeTruthy()
    })

    it('handles utilization lower than target', () => {
      const pairInput = {
        ...pair,
        utilization: BigNumber.from(MINIMUM_TARGET_UTILIZATION.sub(1)),
      }

      const res = interestAccrue(pairInput, pair.interestPerYear)

      expect(res.toString()).toEqual('51404697414431999')
    })

    it('handles utilization lower than target and interest lower than minimum', () => {
      const pairInput = {
        ...pair,
        utilization: BigNumber.from(MINIMUM_TARGET_UTILIZATION.sub(1)),
      }
      const interest = ZERO

      const res = interestAccrue(pairInput, interest)

      expect(res.eq(MINIMUM_INTEREST_PER_YEAR)).toBeTruthy()
    })

    it('handles utilization higher than target', () => {
      const pairInput = {
        ...pair,
        utilization: BigNumber.from(MAXIMUM_TARGET_UTILIZATION.add(1)),
      }

      const res = interestAccrue(pairInput, pair.interestPerYear)

      expect(res.toString()).toEqual('51404697414432000')
    })

    it('handles utilization higher than target and higher than maximum', () => {
      const pairInput = {
        ...pair,
        utilization: BigNumber.from(MAXIMUM_TARGET_UTILIZATION.add(1)),
      }
      const interest = BigNumber.from(MAXIMUM_INTEREST_PER_YEAR.add(1))

      const res = interestAccrue(pairInput, interest)

      expect(res.eq(MAXIMUM_INTEREST_PER_YEAR)).toBeTruthy()
    })

    it('returns input interest if utilization is between range', () => {
      const pairInput = {
        ...pair,
        utilization: BigNumber.from(MINIMUM_TARGET_UTILIZATION.add(1)),
      }
      const interest = BigNumber.from(1)

      const res = interestAccrue(pairInput, interest)

      expect(res.eq(interest)).toBeTruthy()
    })
  })

  describe('getUSDValue', () => {
    it('returns usd value', () => {
      const amount = BigNumber.from(100)
      const res = getUSDValue(amount, pair.asset)

      expect(res.eq(amount)).toBeTruthy()
    })

    it('gets top level decimals if available', () => {
      const decimals = 8
      const assetInput = {
        ...pair.asset,
        decimals,
      }

      const amount = BigNumber.from(100)
      const res = getUSDValue(amount, assetInput)

      const compare = amount.div(e10(decimals - pair.asset.tokenInfo.decimals))

      expect(res.eq(compare)).toBeTruthy()
    })
  })

  describe('getUSDString', () => {
    it('returns usd string', () => {
      const amount = BigNumber.from(100)
      const res = getUSDString(amount, pair.asset)

      expect(res).toEqual('0.0001')
    })

    it('gets top level decimals if available', () => {
      const decimals = 8
      const assetInput = {
        ...pair.asset,
        decimals,
      }

      const amount = BigNumber.from(100)
      const res = getUSDString(amount, assetInput)

      expect(res).toEqual('0.000001')
    })

    it('gets top level chainId if available', () => {
      const chainId = 56 // BSC
      const assetInput = {
        ...pair.asset,
        chainId,
      }

      const amount = BigNumber.from(10000000000)
      const res = getUSDString(amount, assetInput)

      expect(res).toEqual('0.00000001')
    })
  })

  describe('easyAmount', () => {
    it('returns data', () => {
      const amount = BigNumber.from(100)
      const res = easyAmount(amount, pair.asset)

      expect(res).toEqual({
        value: amount,
        string: '0.0001',
        usdValue: BigNumber.from('0x64'),
        usd: '0.0001',
      })
    })

    it('gets top level decimals if available', () => {
      const decimals = 8
      const assetInput = {
        ...pair.asset,
        decimals,
      }
      const amount = BigNumber.from(100)
      const res = easyAmount(amount, assetInput)

      expect(res).toEqual({
        value: amount,
        string: '0.000001',
        usdValue: BigNumber.from('0x01'),
        usd: '0.000001',
      })
    })
  })

  describe('takeFee', () => {
    it('subtracts fee', () => {
      const amount = BigNumber.from('20')

      const res = takeFee(amount)

      expect(res.toString()).toEqual('18')
    })
  })

  describe('addBorrowFee', () => {
    it('adds borrow fee', () => {
      const amount = BigNumber.from('2000')

      const res = addBorrowFee(amount)

      expect(res.toString()).toEqual('2001')
    })
  })

  describe('getFraction', () => {
    it('gets fraction', () => {
      const input = {
        totalAssetBase: 100,
        totalAssetElastic: 10,
        totalBorrowElastic: 20,
        token0: {
          totalSupplyBase: 30,
          totalSupplyElastic: 40,
        },
      }

      const res = getFraction(input)

      expect(res).toEqual(4)
    })
  })
})
