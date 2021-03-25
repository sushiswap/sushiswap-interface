/* eslint-disable @typescript-eslint/camelcase */
import { useActiveWeb3React } from 'hooks'
import useIntervalTransaction from 'hooks/useIntervalTransaction'
import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { useKashiPairHelperContract } from 'sushi-hooks/useContract'
import { BigNumber } from '@ethersproject/bignumber'
import Fraction from '../constants/Fraction'
import sushiData from '@sushiswap/sushi-data'
import { ChainId } from '@sushiswap/sdk'
import getOracleName from '../sushi-hooks/queries/getOracleNames'
import getMainnetAddress from '../sushi-hooks/queries/getMainnetAddress'
import { ethers } from 'ethers'
import {
  MINIMUM_TARGET_UTILIZATION,
  MAXIMUM_TARGET_UTILIZATION,
  UTILIZATION_PRECISION,
  FULL_UTILIZATION,
  FULL_UTILIZATION_MINUS_MAX,
  STARTING_INTEREST_PER_YEAR,
  MINIMUM_INTEREST_PER_YEAR,
  MAXIMUM_INTEREST_PER_YEAR,
  INTEREST_ELASTICITY,
  FACTOR_PRECISION,
  CLONE_ADDRESSES
} from './constants'

enum ActionType {
  SET = 'SET',
  SYNC = 'SYNC'
}

interface Reducer {
  type: ActionType
  payload: any
}

function takeFee(amount: BigNumber) {
  return amount.mul(BigNumber.from(9)).div(BigNumber.from(10))
}

function addBorrowFee(amount: BigNumber) {
  return amount.mul(BigNumber.from(10005)).div(BigNumber.from(10000))
}

// TODO: typing for data structure...
export interface KashiPair {
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

export function KashiProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = useReducer<React.Reducer<State, Reducer>>(reducer, initialState)

  const { account, chainId } = useActiveWeb3React()

  const pairAddresses = CLONE_ADDRESSES[chainId || 1]

  const kashiPairHelperContract = useKashiPairHelperContract()

  const getPairs = useCallback(async () => {
    return kashiPairHelperContract?.getPairs(pairAddresses)
  }, [kashiPairHelperContract, pairAddresses])

  const pollPairs = useCallback(async () => {
    const pairDetails: any = await getPairs()
    //console.log('pairDetails:', pairDetails)

    //console.log('pairUserDetails_inputs:', account, pairAddresses)
    const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, pairAddresses)
    //console.log('pairUserDetails:', pairUserDetails)

    // Get list of tokens and fetch pricing information
    const tokensWithDuplicates: any[] = []
    pairDetails.map((pair: { collateral: string; asset: string }) => {
      tokensWithDuplicates.push(pair.collateral)
      tokensWithDuplicates.push(pair.asset)
    })
    const tokens = Array.from(new Set(tokensWithDuplicates)) // remove duplicates
    const tokensWithDetails = await Promise.all(
      tokens.map(async (address: string) => {
        try {
          const details = await sushiData.exchange.token({
            token_address: getMainnetAddress(address)
          })
          return { address: address, details: details }
        } catch (e) {
          return { address: address, details: { derivedETH: 0 } }
        }
      })
    )
    const exchangeEthPrice = await sushiData.exchange.ethPrice()
    const pricing = tokensWithDetails.map((token): any => {
      if (token) {
        return { address: token.address, priceUSD: token?.details?.derivedETH * exchangeEthPrice }
      }
    })
    //console.log('tokensWithDetails:', tokensWithDetails)
    //console.log('pricing:', pricing)

    const pairs = pairAddresses?.map((address, i) => {
      // Find pricing information
      const asset = pricing.find(pair => pair.address === pairDetails[i].asset)
      const assetUSD = asset.priceUSD
      const collateral = pricing.find(pair => pair.address === pairDetails[i].collateral)
      const collateralUSD = collateral.priceUSD

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

      // const safeMaxBorrowableLeftPossible2 = BigInt.min(pair.safeMaxBorrowable - pair.currentUserBorrowAmount, pair.totalBorrowable.amount.value)

      const safeMaxBorrowableLeftPossible = pairUserDetails[1][i].totalAssetAmount.lt(
        safeMaxBorrowable.sub(pairUserDetails[1][i].userBorrowAmount)
      )
        ? pairUserDetails[1][i].totalAssetAmount
        : safeMaxBorrowable.sub(pairUserDetails[1][i].userBorrowAmount)

      // const safeMaxBorrowableLeftPossible2 = BigNumber.from(, pair.totalBorrowable.amount.value)

      console.log({
        totalBorrowAmount: pairUserDetails[1][i].totalBorrowAmount.toString(),
        userBorrowAmount: pairUserDetails[1][i].userBorrowAmount.toString()
      })

      // console.log(pairUserDetails[1][i].userCollateralAmount)

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

        if (elapsedTime.lte(BigNumber.from(0))) {
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
          if (currentInterest.gt(MAXIMUM_INTEREST_PER_YEAR)) {
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

      // todo: if totalAssetAmount === 0 is userAssetAmount assumed to be 0?
      const userSupply = pairUserDetails[1][i].totalAssetAmount.gt(BigNumber.from(0))
        ? pairUserDetails[1][i].userAssetAmount.add(
            pairUserDetails[1][i].userAssetAmount
              .mul(pairUserDetails[1][i].totalBorrowAmount) // change resolution by mul first!
              .div(pairUserDetails[1][i].totalAssetAmount)
          )
        : BigNumber.from(0)

      // const test = pairUserDetails[1][i].userAssetAmount
      //   .mul(pairUserDetails[1][i].totalBorrowAmount)
      //   .div(pairUserDetails[1][i].totalAssetAmount)
      // console.log('userSupply:', address, {
      //   userAssetAmount: Fraction.from(
      //     pairUserDetails[1][i].userAssetAmount,
      //     BigNumber.from(10).pow(BigNumber.from(pairDetails[i].assetDecimals))
      //   ).toString(),
      //   totalAssetAmount: Fraction.from(
      //     pairUserDetails[1][i].totalAssetAmount,
      //     BigNumber.from(10).pow(BigNumber.from(pairDetails[i].assetDecimals))
      //   ).toString(),
      //   totalBorrowAmount: Fraction.from(
      //     pairUserDetails[1][i].totalBorrowAmount,
      //     BigNumber.from(10).pow(BigNumber.from(pairDetails[i].assetDecimals))
      //   ).toString(),
      //   userSupply: Fraction.from(
      //     userSupply,
      //     BigNumber.from(10).pow(BigNumber.from(pairDetails[i].assetDecimals))
      //   ).toString(),
      //   userSupplyRaw: pairUserDetails[1][i].userAssetAmount.add(
      //     pairUserDetails[1][i].userAssetAmount.div(pairUserDetails[1][i].totalAssetAmount)
      //   ),
      //   test: Fraction.from(test, BigNumber.from(10).pow(BigNumber.from(pairDetails[i].assetDecimals))).toString()
      // })
      // Test Cases:
      // userAssetAmount + (userAssetAmount / totalAssetAmount) * totalBorrowAmount
      // 18.95653793 + (18.95653793 / 511.83397452) * 28.18237205
      // totalAssetAmount: '511.83397452'
      // totalBorrowAmount: '28.18237205'
      // userAssetAmount: '18.95653793'
      // userSupply: '18.95653793'

      // Supply + Collateral - Borrrow
      const pairNetWorth =
        Number(Fraction.from(userSupply, BigNumber.from(10).pow(pairDetails[i].assetDecimals))) * assetUSD +
        Number(
          Fraction.from(
            BigNumber.from(pairUserDetails[1][i].userCollateralAmount),
            BigNumber.from(10).pow(pairDetails[i].collateralDecimals)
          ).toString()
        ) *
          collateralUSD -
        Number(
          Fraction.from(
            BigNumber.from(pairUserDetails[1][i].userBorrowAmount),
            BigNumber.from(10).pow(pairDetails[i].assetDecimals)
          ).toString()
        ) *
          assetUSD

      //const pairNetAPY =

      console.log({
        currentUserBorrowAmount: currentUserBorrowAmount.toString(),
        maxBorrowable: maxBorrowable.toString(),
        safeMaxBorrowable: safeMaxBorrowable.toString(),
        safeMaxBorrowableLeft: safeMaxBorrowableLeft.toString(),
        safeMaxBorrowableLeftPossible: safeMaxBorrowableLeftPossible.toString()
      })

      return {
        id: address,
        address: address,
        currentUserBorrowAmount,
        maxBorrowable,
        safeMaxBorrowable,
        safeMaxBorrowableLeft,
        safeMaxBorrowableLeftPossible,
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
            },
            supply: {
              value: pairUserDetails[1][i].totalAssetAmount.add(pairUserDetails[1][i].totalBorrowAmount),
              string: Fraction.from(
                pairUserDetails[1][i].totalAssetAmount.add(pairUserDetails[1][i].totalBorrowAmount),
                BigNumber.from(10).pow(pairDetails[i].assetDecimals)
              ).toString(),
              usdString:
                Number(
                  Fraction.from(
                    pairUserDetails[1][i].totalAssetAmount.add(pairUserDetails[1][i].totalBorrowAmount),
                    BigNumber.from(10).pow(pairDetails[i].assetDecimals)
                  ).toString()
                ) * assetUSD
            },
            // utilization: total Borrow / total Assets
            utilization: {
              string:
                Number(
                  Fraction.from(
                    pairUserDetails[1][i].totalBorrowAmount,
                    pairUserDetails[1][i].totalAssetAmount.add(pairUserDetails[1][i].totalBorrowAmount)
                  ).toString()
                ) * 100
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
            currentInterestPerYear: Fraction.from(currentInterestPerYear, BigNumber.from(10).pow(16)).toString(),
            interestPerYear: Fraction.from(interestPerYear, BigNumber.from(10).pow(16)).toString()
          },
          borrowInterestPerSecond: pairUserDetails[1][i].borrowAPR
        },
        user: {
          pairNetWorth: {
            usdString: pairNetWorth
          },
          health: {
            percentage: maxBorrowable.gt(BigNumber.from(0))
              ? Fraction.from(
                  currentUserBorrowAmount.mul(BigNumber.from('1000000000000000000')).div(maxBorrowable),
                  BigNumber.from(10).pow(16)
                ).toString()
              : BigNumber.from(0)
          },
          collateral: {
            max: {
              value: safeMaxRemovable,
              balance: {
                value: safeMaxRemovable,
                decimals: pairDetails[i].collateralDecimals
              },
              string: Fraction.from(
                safeMaxRemovable,
                BigNumber.from(10).pow(pairDetails[i].collateralDecimals)
              ).toString()
            },
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
              ) * collateralUSD,
            balance: {
              value: pairUserDetails[1][i].userCollateralAmount,
              decimals: pairDetails[i].collateralDecimals
            }
          },
          supply: {
            value: userSupply,
            string: Fraction.from(userSupply, BigNumber.from(10).pow(pairDetails[i].assetDecimals)).toString(),
            usdString:
              Number(Fraction.from(userSupply, BigNumber.from(10).pow(pairDetails[i].assetDecimals))) * assetUSD,
            balance: {
              value: userSupply,
              decimals: pairDetails[i].assetDecimals
            }
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
            max: {
              value: safeMaxBorrowableLeftPossible,
              balance: {
                value: safeMaxBorrowableLeftPossible,
                decimals: pairDetails[i].assetDecimals
              },
              string: Fraction.from(
                safeMaxBorrowableLeftPossible,
                BigNumber.from(10).pow(pairDetails[i].assetDecimals)
              ).toString()
            },
            maxUSD:
              Number(
                Fraction.from(
                  safeMaxBorrowableLeftPossible,
                  BigNumber.from(10).pow(pairDetails[i].assetDecimals)
                ).toString()
              ) * assetUSD,
            value: pairUserDetails[1][i].userBorrowAmount,
            balance: {
              value: pairUserDetails[1][i].userBorrowAmount,
              decimals: pairDetails[i].assetDecimals
            },
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
  }, [account, getPairs, kashiPairHelperContract, pairAddresses])

  useIntervalTransaction(pollPairs, process.env.NODE_ENV !== 'production' ? 1000 : 10000)

  return (
    <KashiContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      {children}
    </KashiContext.Provider>
  )
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
