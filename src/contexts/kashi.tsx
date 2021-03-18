import { useActiveWeb3React } from 'hooks'
import useInterval from 'hooks/useInterval'
import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { useKashiPairHelperContract } from 'sushi-hooks/useContract'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import Fraction from '../constants/Fraction'
import sushiData from '@sushiswap/sushi-data'
import getOracleName from '../sushi-hooks/queries/getOracleNames'
import getMainnetAddress from '../sushi-hooks/queries/getMainnetAddress'
import { ethers } from 'ethers'

enum ActionType {
  SET = 'SET',
  SYNC = 'SYNC'
}

interface Reducer {
  type: ActionType
  payload: any
}

// TODO: typing for data structure...
interface KashiPair {
  id: string
  address: string
  collateral: {
    address: string
    symbol: string
    decimals: number
  }
  asset: {
    address: string
    symbol: string
    decimals: number
  }
  oracle: {
    name: string
  }
  details: any
  user: any
}

interface State {
  pairsSupplied: number
  markets: number
  pairsBorrowed: number
  pairs: KashiPair[]
}

const initialState: State = {
  pairsSupplied: 0,
  markets: 0,
  pairsBorrowed: 0,
  pairs: []
}

export const KashiContext = createContext<{
  state: State
  dispatch: React.Dispatch<any>
}>({
  state: initialState,
  dispatch: () => null
})

const reducer: React.Reducer<State, Reducer> = (state, action) => {
  switch (action.type) {
    case ActionType.SYNC:
      // TODO: Sync pairs
      console.log('SYNC PAIRS')
      return {
        ...state
      }
    case ActionType.SET:
      const { info, pairs } = action.payload
      const [pairsSupplied, pairsBorrowed] = info
      return {
        ...state,
        pairsSupplied: pairsSupplied.toString(),
        markets: pairs.length,
        pairsBorrowed: pairsBorrowed.toString(),
        pairs
      }
    default:
      return state
  }
}

const pairAddresses = [
  '0x2E082FBe03d87EFf58cC58b35b89b2539c9d868a',
  '0xDb947db159587A8297c19786130db7C312e7e158',
  '0x7f90326CcbE06c7BF462f929A20b0e3300F231D3',
  '0x8A227eA25804c0f3b312C4a2C6220ECc06be93aF',
  '0x022244f0763c43e547cA130D86C9e3546851Aa7A',
  '0x7Dcc8e2524f8Ee85F7ec9F1589750D7e0673c799',
  '0xC897c111FAC56B6342ce2394120A47E6568C1029',
  '0x8BC61EEc07e9F7C93B6B35D46F36473323A48b49',
  '0xFcBFB3236e7777ace26e50cD6EFDCe810Bd1ae42',
  '0x78E05BD767418FD8F7D78E6668fA139a887d5575',
  '0xdEFC98C1F8544F65b7541325eA7f66aA66F2Eb52',
  '0xe2a53cD419a9CB673e89b53f467559af12395f4F',
  '0x19F855526eb5Bc7C90690f88aF98bC870edEbcCc'
]

const MINIMUM_TARGET_UTILIZATION = BigNumber.from('700000000000000000') // 70%
const MAXIMUM_TARGET_UTILIZATION = BigNumber.from('800000000000000000') // 80%
const UTILIZATION_PRECISION = BigNumber.from('1000000000000000000')
const FULL_UTILIZATION = BigNumber.from('1000000000000000000')
const FULL_UTILIZATION_MINUS_MAX = FULL_UTILIZATION.sub(MAXIMUM_TARGET_UTILIZATION)
const STARTING_INTEREST_PER_YEAR = BigNumber.from(68493150675)
  .mul(BigNumber.from(60))
  .mul(BigNumber.from(60))
  .mul(BigNumber.from(24))
  .mul(BigNumber.from(365)) // approx 1% APR
const MINIMUM_INTEREST_PER_YEAR = BigNumber.from(17123287665)
  .mul(BigNumber.from(60))
  .mul(BigNumber.from(60))
  .mul(BigNumber.from(24))
  .mul(BigNumber.from(365)) // approx 0.25% APR
const MAXIMUM_INTEREST_PER_YEAR = BigNumber.from(68493150675000)
  .mul(BigNumber.from(60))
  .mul(BigNumber.from(60))
  .mul(BigNumber.from(24))
  .mul(BigNumber.from(365)) // approx 1000% APR

const INTEREST_ELASTICITY = BigNumber.from('28800000000000000000000000000000000000000') // Half or double in 28800 seconds (8 hours) if linear
const FACTOR_PRECISION = BigNumber.from('1000000000000000000')

function takeFee(amount: BigNumber) {
  return amount.mul(BigNumber.from(9)).div(BigNumber.from(10))
}

function addBorrowFee(amount: BigNumber) {
  return amount.mul(BigNumber.from(10005)).div(BigNumber.from(10000))
}

export function KashiProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = useReducer<React.Reducer<State, Reducer>>(reducer, initialState)

  const { account } = useActiveWeb3React()

  const kashiPairHelperContract = useKashiPairHelperContract()

  const getPairs = useCallback(async () => {
    return kashiPairHelperContract?.getPairs(pairAddresses)
  }, [kashiPairHelperContract])

  const pollPairs = useCallback(async () => {
    const pairDetails: any = await getPairs()
    //console.log('pairDetails:', pairDetails)

    //console.log('pairUserDetails_inputs:', account, pairAddresses)
    const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, pairAddresses)
    //console.log('pairUserDetails:', pairUserDetails)
    //console.log('details:', pairDetails[0].collateral)

    // Get SushiSwap Exchange pricing data for USD estimates
    const collateralSushiData = await sushiData.exchange.token({
      // eslint-disable-next-line @typescript-eslint/camelcase
      token_address: getMainnetAddress(pairDetails?.[0]?.collateral)
    })
    const assetSushiData = await sushiData.exchange.token({
      // eslint-disable-next-line @typescript-eslint/camelcase
      token_address: getMainnetAddress(pairDetails?.[0]?.asset)
    })
    const exchangeEthPrice = await sushiData.exchange.ethPrice()
    const collateralUSD = collateralSushiData?.derivedETH * exchangeEthPrice
    const assetUSD = assetSushiData?.derivedETH * exchangeEthPrice
    console.log('collateralUSD:', collateralUSD)
    console.log('assetUSD:', assetUSD)

    const pairs = pairAddresses.map((address, i) => {
      function accrue(amount: BigNumber) {
        return amount
          .mul(
            pairUserDetails[1][i].accrueInfo.interestPerSecond.mul(
              BigNumber.from(Date.now())
                .div(BigNumber.from(1000))
                .sub(pairUserDetails[1][i].accrueInfo.lastAccrued)
            )
          )
          .div(BigNumber.from('1000000000000000000'))
      }

      const currentBorrowAmount = pairUserDetails[1][i].totalBorrowAmount.add(
        accrue(pairUserDetails[1][i].totalBorrowAmount)
      )

      const currentUserBorrowAmount = pairUserDetails[1][i].userBorrowAmount.add(
        takeFee(accrue(pairUserDetails[1][i].userBorrowAmount))
      )

      const maxBorrowableOracle = pairUserDetails[1][i].oracleExchangeRate.gt(BigNumber.from(0))
        ? pairUserDetails[1][i].userCollateralAmount
            .mul(BigNumber.from('1000000000000000000'))
            .div(BigNumber.from(100))
            .mul(BigNumber.from(75))
            .div(pairUserDetails[1][0].oracleExchangeRate)
        : BigNumber.from(0)

      const maxBorrowableStored = pairUserDetails[1][i].currentExchangeRate.gt(BigNumber.from(0))
        ? pairUserDetails[1][i].userCollateralAmount
            .mul(BigNumber.from('1000000000000000000'))
            .div(BigNumber.from(100))
            .mul(BigNumber.from(75))
            .div(pairUserDetails[1][0].currentExchangeRate)
        : BigNumber.from(0)

      const maxBorrowable = maxBorrowableOracle.lt(maxBorrowableStored) ? maxBorrowableOracle : maxBorrowableStored

      const safeMaxBorrowable = maxBorrowable.div(BigNumber.from(100)).mul(BigNumber.from(95))

      const safeMaxBorrowableLeft = safeMaxBorrowable.sub(pairUserDetails[1][i].userBorrowAmount)

      const safeMaxBorrowableLeftPossible = pairUserDetails[1][i].totalBorrowAmount.lt(
        safeMaxBorrowable.sub(pairUserDetails[1][i].userBorrowAmount)
      )
        ? pairUserDetails[1][i].totalBorrowAmount
        : safeMaxBorrowable.sub(pairUserDetails[1][i].userBorrowAmount)

      const safeMaxRemovable = pairUserDetails[1][i].userCollateralAmount.gt(BigNumber.from(0))
        ? pairUserDetails[1][i].userCollateralAmount.sub(
            pairUserDetails[1][i].userCollateralAmount
              .mul(safeMaxBorrowable.sub(safeMaxBorrowableLeft))
              .div(safeMaxBorrowable)
          )
        : BigNumber.from(0)

      const utilization = currentBorrowAmount.gt(BigNumber.from(0))
        ? currentBorrowAmount
            .mul(BigNumber.from('1000000000000000000'))
            .div(pairUserDetails[1][i].totalAssetAmount.add(currentBorrowAmount))
        : BigNumber.from(0)

      function interestAccrue(interest: BigNumber) {
        if (pairUserDetails[1][i].totalBorrowAmount.eq(BigNumber.from(0))) {
          return STARTING_INTEREST_PER_YEAR
        }

        let currentInterest = interest

        const elapsedTime = BigNumber.from(Date.now())
          .div(BigNumber.from(1000))
          .sub(pairUserDetails[1][i].accrueInfo.lastAccrued)

        if (elapsedTime.eq(BigNumber.from(0))) {
          return currentInterest
        }

        if (utilization.lt(MINIMUM_TARGET_UTILIZATION)) {
          const underFactor = MINIMUM_TARGET_UTILIZATION.sub(utilization)
            .mul(FACTOR_PRECISION)
            .div(MINIMUM_TARGET_UTILIZATION)
          const scale = INTEREST_ELASTICITY.add(underFactor.mul(underFactor.mul(elapsedTime)))
          currentInterest = currentInterest.mul(INTEREST_ELASTICITY).div(scale)

          if (currentInterest.lt(MINIMUM_INTEREST_PER_YEAR)) {
            currentInterest = MINIMUM_INTEREST_PER_YEAR // 0.25% APR minimum
          }
        } else if (utilization.gt(MAXIMUM_TARGET_UTILIZATION)) {
          const overFactor = utilization
            .sub(MAXIMUM_TARGET_UTILIZATION)
            .mul(FACTOR_PRECISION.div(FULL_UTILIZATION_MINUS_MAX))
          const scale = INTEREST_ELASTICITY.add(overFactor.mul(overFactor.mul(elapsedTime)))
          currentInterest = currentInterest.mul(scale).div(INTEREST_ELASTICITY)
          if (currentInterest.lt(MAXIMUM_INTEREST_PER_YEAR)) {
            currentInterest = MAXIMUM_INTEREST_PER_YEAR // 1000% APR maximum
          }
        }
        return currentInterest
      }

      const interestPerYear = pairUserDetails[1][i].accrueInfo.interestPerSecond
        .mul(BigNumber.from(60))
        .mul(BigNumber.from(60))
        .mul(BigNumber.from(24))
        .mul(BigNumber.from(365))

      const currentInterestPerYear = interestAccrue(interestPerYear)

      const currentSupplyAPR = Fraction.from(
        takeFee(currentInterestPerYear.mul(utilization)).div(BigNumber.from(10).pow(BigNumber.from(18))),
        BigNumber.from(10).pow(BigNumber.from(16))
      ).toString()

      return {
        id: address,
        address: address,
        oracle: {
          address: pairDetails[i].oracle,
          name: getOracleName(pairDetails[i].oracle),
          data: pairDetails[i].oracleData
        },
        collateral: {
          address: pairDetails[i].collateral,
          symbol: pairDetails[i].collateralSymbol,
          decimals: pairDetails[i].collateralDecimals
        },
        asset: {
          address: pairDetails[i].asset,
          symbol: pairDetails[i].assetSymbol,
          decimals: pairDetails[i].assetDecimals
        },
        details: {
          total: {
            collateral: {
              value: pairUserDetails[1][i].totalCollateralAmount,
              string: Fraction.from(
                BigNumber.from(pairUserDetails[1][i].totalCollateralAmount),
                BigNumber.from(10).pow(pairDetails[i].collateralDecimals)
              ).toString(),
              usdString:
                Number(
                  Fraction.from(
                    BigNumber.from(pairUserDetails[1][i].totalCollateralAmount),
                    BigNumber.from(10).pow(pairDetails[i].collateralDecimals)
                  ).toString()
                ) * collateralUSD
            },
            asset: {
              value: pairUserDetails[1][i].totalAssetAmount,
              string: Fraction.from(
                BigNumber.from(pairUserDetails[1][i].totalAssetAmount),
                BigNumber.from(10).pow(pairDetails[i].assetDecimals)
              ).toString(),
              usdString:
                Number(
                  Fraction.from(
                    BigNumber.from(pairUserDetails[1][i].totalAssetAmount),
                    BigNumber.from(10).pow(pairDetails[i].assetDecimals)
                  ).toString()
                ) * assetUSD
            },
            borrow: {
              value: pairUserDetails[1][i].totalBorrowAmount,
              string: Fraction.from(
                BigNumber.from(pairUserDetails[1][i].totalBorrowAmount),
                BigNumber.from(10).pow(pairDetails[i].assetDecimals)
              ).toString(),
              usdString:
                Number(
                  Fraction.from(
                    BigNumber.from(pairUserDetails[1][i].totalBorrowAmount),
                    BigNumber.from(10).pow(pairDetails[i].assetDecimals)
                  ).toString()
                ) * assetUSD
            }
          },
          rate: {
            current: pairUserDetails[1][i].currentExchangeRate,
            oracle: pairUserDetails[1][i].oracleExchangeRate
          },
          apr: {
            asset: pairUserDetails[1][i].assetAPR / 1e6,
            borrow: pairUserDetails[1][i].borrowAPR / 1e6,
            supplyAPR: Fraction.from(
              takeFee(interestPerYear.mul(utilization)).div(BigNumber.from('1000000000000000000')),
              BigNumber.from('10000000000000000')
            ).toString(),
            currentSupplyAPR,
            currentInterestPerYear: Fraction.from(
              currentInterestPerYear,
              BigNumber.from(10).pow(BigNumber.from(16))
            ).toString()
          },
          borrowInterestPerSecond: pairUserDetails[1][i].borrowAPR
        },
        user: {
          health: {
            percentage: maxBorrowable.gt(BigNumber.from(0))
              ? Fraction.from(
                  currentUserBorrowAmount.mul(BigNumber.from('1000000000000000000')).div(maxBorrowable),
                  BigNumber.from(10).pow(16)
                ).toString()
              : BigNumber.from(0)
          },
          collateral: {
            max: Fraction.from(safeMaxRemovable, BigNumber.from(10).pow(pairDetails[i].collateralDecimals)).toString(),
            value: pairUserDetails[1][i].userCollateralAmount,
            string: Fraction.from(
              BigNumber.from(pairUserDetails[1][i].userCollateralAmount),
              BigNumber.from(10).pow(pairDetails[i].collateralDecimals)
            ).toString(),
            usdString:
              Number(
                Fraction.from(
                  BigNumber.from(pairUserDetails[1][i].userCollateralAmount),
                  BigNumber.from(10).pow(pairDetails[i].collateralDecimals)
                ).toString()
              ) * collateralUSD
          },
          asset: {
            value: pairUserDetails[1][i].userAssetAmount,
            string: Fraction.from(
              BigNumber.from(pairUserDetails[1][i].userAssetAmount),
              BigNumber.from(10).pow(pairDetails[i].assetDecimals)
            ).toString(),
            usdString:
              Number(
                Fraction.from(
                  BigNumber.from(pairUserDetails[1][i].userAssetAmount),
                  BigNumber.from(10).pow(pairDetails[i].assetDecimals)
                ).toString()
              ) * assetUSD
          },
          borrow: {
            max: Fraction.from(
              safeMaxBorrowableLeftPossible,
              BigNumber.from(10).pow(pairDetails[i].assetDecimals)
            ).toString(),
            value: pairUserDetails[1][i].userBorrowAmount,
            string: Fraction.from(
              BigNumber.from(pairUserDetails[1][i].userBorrowAmount),
              BigNumber.from(10).pow(pairDetails[i].assetDecimals)
            ).toString(),
            usdString:
              Number(
                Fraction.from(
                  BigNumber.from(pairUserDetails[1][i].userBorrowAmount),
                  BigNumber.from(10).pow(pairDetails[i].assetDecimals)
                ).toString()
              ) * assetUSD
          }
        }
      }
    })

    dispatch({
      type: ActionType.SET,
      payload: {
        info: pairUserDetails[0],
        pairs
      }
    })
  }, [account, getPairs, kashiPairHelperContract])

  useInterval(pollPairs, 10000)

  return <KashiContext.Provider value={{ state, dispatch }}>{children}</KashiContext.Provider>
}

export function useKashiCounts() {
  const context = useContext(KashiContext)
  if (context === undefined) {
    throw new Error('useKashiCounts must be used within a KashiProvider')
  }
  return {
    pairsSupplied: context.state.pairsSupplied,
    markets: context.state.markets,
    pairsBorrowed: context.state.pairsBorrowed
  }
}

export function useKashiPairs() {
  const context = useContext(KashiContext)
  if (context === undefined) {
    throw new Error('useKashiPairs must be used within a KashiProvider')
  }
  return context.state.pairs
}

export function useKashiPair(id: string) {
  const context = useContext(KashiContext)
  if (context === undefined) {
    throw new Error('useKashiPair must be used within a KashiProvider')
  }

  return context.state.pairs.find((pair: KashiPair) => {
    return ethers.utils.getAddress(pair.id) === ethers.utils.getAddress(id)
  })
}
