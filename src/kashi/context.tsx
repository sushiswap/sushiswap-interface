/* eslint-disable @typescript-eslint/camelcase */
import { useActiveWeb3React } from 'hooks'
import useIntervalTransaction from 'hooks/useIntervalTransaction'
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { useBentoBoxContract, useKashiPairContract } from 'sushi-hooks/useContract'
import { BigNumber } from '@ethersproject/bignumber'
import Fraction from '../constants/Fraction'
import sushiData from '@sushiswap/sushi-data'
import { ChainId, Token } from '@sushiswap/sdk'
import { getOracleName, getMainnetAddress, takeFee, addBorrowFee, toElastic, accrue } from './functions'
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
import { useBoringHelperContract } from 'hooks/useContract'
import { JSBI } from '@sushiswap/sdk'
import { useDefaultTokens } from 'hooks/Tokens'

enum ActionType {
  UPDATE = 'UPDATE',
  SYNC = 'SYNC'
}

interface Reducer {
  type: ActionType
  payload: any
}

// TODO: typing for data structure...
// export interface KashiPair {
//   id: string
//   address: string
//   collateral: Token
//   asset: Token
//   oracle: {
//     name: string
//   }
//   details: any
//   user: any
// }

import { KashiPollPair } from './entities'

interface State {
  pairsSupplied: number
  markets: number
  pairsBorrowed: number
  pairs: any[]
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
    case ActionType.UPDATE:
      console.log('UPDATE PAIRS')
      const { pairs } = action.payload
      return {
        ...state,
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

  const boringHelperContract = useBoringHelperContract()

  const bentoBoxContract = useBentoBoxContract()

  const kashiPairContract = useKashiPairContract()

  const tokens = useDefaultTokens()

  // TODO: Only call get pairs when there is a reason to, subscribe to something.
  // Recalculate every second without polling until then.

  useEffect(() => {
    async function getPairs() {
      if (boringHelperContract && bentoBoxContract && kashiPairContract && pairAddresses) {
        const pairs = await boringHelperContract.pollKashiPairs(account, pairAddresses)
        dispatch({
          type: ActionType.UPDATE,
          payload: {
            pairs: await Promise.all(
              pairs.map(
                async (
                  {
                    accrueInfo,
                    asset,
                    collateral,
                    currentExchangeRate,
                    oracle,
                    oracleData,
                    oracleExchangeRate,
                    spotExchangeRate,
                    totalAsset,
                    totalBorrow,
                    totalCollateralShare,
                    userAssetFraction,
                    userBorrowPart,
                    userCollateralShare
                  }: KashiPollPair,
                  i: number
                ) => {
                  const totalCollateralAmount = await bentoBoxContract.toAmount(collateral, totalCollateralShare, false)

                  const userCollateralAmount = await bentoBoxContract.toAmount(collateral, userCollateralShare, false)

                  const totalAssetAmount = await bentoBoxContract.toAmount(asset, totalAsset.elastic, false)

                  const userAssetAmount = await bentoBoxContract.toAmount(
                    asset,
                    toElastic(totalAsset, await kashiPairContract.balanceOf(account), false),
                    false
                  )

                  const totalBorrowAmount = totalBorrow.elastic.eq(BigNumber.from(0))
                    ? BigNumber.from(1)
                    : totalBorrow.elastic

                  const userBorrowAmount = toElastic(
                    totalBorrow,
                    await kashiPairContract.userBorrowPart(account),
                    false
                  )

                  function accrue(amount: BigNumber) {
                    return amount
                      .mul(
                        accrueInfo.interestPerSecond.mul(
                          BigNumber.from(Date.now())
                            .div(BigNumber.from(1000))
                            .sub(accrueInfo.lastAccrued)
                        )
                      )
                      .div(BigNumber.from('1000000000000000000'))
                  }

                  const currentBorrowAmount = totalBorrowAmount.add(accrue(totalBorrowAmount))

                  const currentUserBorrowAmount = userBorrowAmount.add(takeFee(accrue(userBorrowAmount)))

                  const utilization = currentBorrowAmount.gt(BigNumber.from(0))
                    ? currentBorrowAmount
                        .mul(BigNumber.from('1000000000000000000'))
                        .div(totalAssetAmount.add(currentBorrowAmount))
                    : BigNumber.from(0)

                  function interestAccrue(interest: BigNumber) {
                    if (totalBorrowAmount.eq(BigNumber.from(0))) {
                      return STARTING_INTEREST_PER_YEAR
                    }

                    let currentInterest = interest

                    const elapsedTime = BigNumber.from(Date.now())
                      .div(BigNumber.from(1000))
                      .sub(accrueInfo.lastAccrued)

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

                  const interestPerYear = accrueInfo.interestPerSecond
                    .mul(BigNumber.from(60))
                    .mul(BigNumber.from(60))
                    .mul(BigNumber.from(24))
                    .mul(BigNumber.from(365))

                  const currentInterestPerYear = interestAccrue(interestPerYear)

                  const currentSupplyAPR = takeFee(currentInterestPerYear.mul(utilization)).div(
                    BigNumber.from(10).pow(BigNumber.from(18))
                  )

                  return {
                    address: pairAddresses[i],
                    accrueInfo: {
                      feesEarnedFraction: accrueInfo.feesEarnedFraction,
                      interestPerSecond: accrueInfo.interestPerSecond,
                      lastAccrued: accrueInfo.lastAccrued
                    },
                    asset: {
                      ...tokens[asset]
                    },
                    collateral: {
                      ...tokens[collateral]
                    },
                    currentExchangeRate,
                    oracle,
                    oracleData,
                    oracleExchangeRate,
                    spotExchangeRate,
                    totalAsset: {
                      elastic: totalAsset.elastic,
                      base: totalAsset.base
                    },
                    totalBorrow: {
                      elastic: totalBorrow.elastic,
                      base: totalBorrow.base
                    },
                    totalCollateralShare,
                    userAssetFraction,
                    userBorrowPart,
                    userCollateralShare,

                    // computed
                    totalCollateralAmount,
                    userCollateralAmount,
                    totalAssetAmount,
                    userAssetAmount,
                    totalBorrowAmount,
                    userBorrowAmount,

                    currentBorrowAmount,
                    currentUserBorrowAmount,

                    currentInterestPerYear,
                    currentSupplyAPR,

                    // getters

                    // get interest(): BigNumber {
                    //   return accrueInfo.interestPerSecond
                    // },

                    // get interestPerYear(): BigNumber {
                    //   return accrueInfo.interestPerSecond
                    //     .mul(BigNumber.from(60))
                    //     .mul(BigNumber.from(60))
                    //     .mul(BigNumber.from(24))
                    //     .mul(BigNumber.from(365))
                    // },

                    // get utilization(): BigNumber {
                    //   return currentBorrowAmount.gt(BigNumber.from(0))
                    //     ? currentBorrowAmount
                    //         .mul(BigNumber.from('1000000000000000000'))
                    //         .div(totalAssetAmount.add(currentBorrowAmount))
                    //     : BigNumber.from(0)
                    // },

                    get maxBorrowableOracle(): BigNumber {
                      return oracleExchangeRate.gt(BigNumber.from(0))
                        ? userCollateralAmount
                            .mul(BigNumber.from('1000000000000000000'))
                            .div(BigNumber.from(100))
                            .mul(BigNumber.from(75))
                            .div(oracleExchangeRate)
                        : BigNumber.from(0)
                    },

                    get maxBorrowableStored(): BigNumber {
                      return currentExchangeRate.gt(BigNumber.from(0))
                        ? userCollateralAmount
                            .mul(BigNumber.from('1000000000000000000'))
                            .div(BigNumber.from(100))
                            .mul(BigNumber.from(75))
                            .div(currentExchangeRate)
                        : BigNumber.from(0)
                    },

                    get maxBorrowable(): BigNumber {
                      return this.maxBorrowableOracle.lt(this.maxBorrowableStored)
                        ? this.maxBorrowableOracle
                        : this.maxBorrowableStored
                    },

                    get safeMaxBorrowable(): BigNumber {
                      return this.maxBorrowable.div(BigNumber.from(100)).mul(BigNumber.from(95))
                    },

                    get safeMaxBorrowableLeft(): BigNumber {
                      return this.safeMaxBorrowable.sub(userBorrowAmount)
                    },

                    get safeMaxBorrowableLeftPossible(): BigNumber {
                      return totalAssetAmount.lt(this.safeMaxBorrowable.sub(userBorrowAmount))
                        ? totalAssetAmount
                        : this.safeMaxBorrowable.sub(userBorrowAmount)
                    },

                    get safeMaxRemovable(): BigNumber {
                      return userCollateralAmount.gt(BigNumber.from(0))
                        ? userCollateralAmount.sub(
                            userCollateralAmount
                              .mul(this.safeMaxBorrowable.sub(this.safeMaxBorrowableLeft))
                              .div(this.safeMaxBorrowable)
                          )
                        : BigNumber.from(0)
                    },

                    get safeMaxRemovableLeft(): BigNumber {
                      return this.safeMaxRemovable
                    },

                    get safeMaxRemovableLeftPossible(): BigNumber {
                      // TODO: What is possible?
                      return BigNumber.from(0)
                    },

                    get pairHealth(): BigNumber {
                      return this.maxBorrowable.gt(BigNumber.from(0))
                        ? currentUserBorrowAmount.mul(BigNumber.from(1000000000000000000)).div(this.maxBorrowable)
                        : BigNumber.from(0)
                    }
                  }
                }
              )
            )
          }
        })
      }
    }
    getPairs()
  }, [boringHelperContract, bentoBoxContract, kashiPairContract, account, pairAddresses, tokens])

  // const kashiPairHelperContract = useKashiPairHelperContract()

  // const getPairs = useCallback(async () => {
  //   return kashiPairHelperContract?.getPairs(pairAddresses)
  // }, [kashiPairHelperContract, pairAddresses])

  // const pollPairs = useCallback(async () => {
  //   if (account && chainId) {
  //     const pairDetails: any = await getPairs()

  //     const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, pairAddresses)

  //     const tokensWithDuplicates: any[] = []
  //     pairDetails.map((pair: { collateral: string; asset: string }) => {
  //       tokensWithDuplicates.push(pair.collateral)
  //       tokensWithDuplicates.push(pair.asset)
  //     })
  //     const tokens = Array.from(new Set(tokensWithDuplicates)) // remove duplicates
  //     const tokensWithDetails = await Promise.all(
  //       tokens.map(async (address: string) => {
  //         try {
  //           const details = await sushiData.exchange.token({
  //             token_address: chainId !== ChainId.MAINNET ? getMainnetAddress(address) : address
  //           })
  //           return { address: address, details: details }
  //         } catch (e) {
  //           return { address: address, details: { derivedETH: 0 } }
  //         }
  //       })
  //     )
  //     const exchangeEthPrice = await sushiData.exchange.ethPrice()
  //     const pricing = tokensWithDetails.map((token): any => {
  //       if (token) {
  //         return { address: token.address, priceUSD: token?.details?.derivedETH * exchangeEthPrice }
  //       }
  //     })

  //     const pairs = pairAddresses?.map((address, i) => {
  //       // Find pricing information
  //       const asset = pricing.find(pair => pair.address === pairDetails[i].asset)
  //       const assetUSD = asset.priceUSD
  //       const collateral = pricing.find(pair => pair.address === pairDetails[i].collateral)
  //       const collateralUSD = collateral.priceUSD

  //       function accrue(amount: BigNumber) {
  //         return amount
  //           .mul(
  //             pairUserDetails[1][i].accrueInfo.interestPerSecond.mul(
  //               BigNumber.from(Date.now())
  //                 .div(BigNumber.from(1000))
  //                 .sub(pairUserDetails[1][i].accrueInfo.lastAccrued)
  //             )
  //           )
  //           .div(BigNumber.from('1000000000000000000'))
  //       }

  //       const currentBorrowAmount = pairUserDetails[1][i].totalBorrowAmount.add(
  //         accrue(pairUserDetails[1][i].totalBorrowAmount)
  //       )

  //       const currentUserBorrowAmount = pairUserDetails[1][i].userBorrowAmount.add(
  //         takeFee(accrue(pairUserDetails[1][i].userBorrowAmount))
  //       )

  //       const maxBorrowableOracle = pairUserDetails[1][i].oracleExchangeRate.gt(BigNumber.from(0))
  //         ? pairUserDetails[1][i].userCollateralAmount
  //             .mul(BigNumber.from('1000000000000000000'))
  //             .div(BigNumber.from(100))
  //             .mul(BigNumber.from(75))
  //             .div(pairUserDetails[1][i].oracleExchangeRate)
  //         : BigNumber.from(0)

  //       const maxBorrowableStored = pairUserDetails[1][i].currentExchangeRate.gt(BigNumber.from(0))
  //         ? pairUserDetails[1][i].userCollateralAmount
  //             .mul(BigNumber.from('1000000000000000000'))
  //             .div(BigNumber.from(100))
  //             .mul(BigNumber.from(75))
  //             .div(pairUserDetails[1][i].currentExchangeRate)
  //         : BigNumber.from(0)

  //       const maxBorrowable = maxBorrowableOracle.lt(maxBorrowableStored) ? maxBorrowableOracle : maxBorrowableStored

  //       const safeMaxBorrowable = maxBorrowable.div(BigNumber.from(100)).mul(BigNumber.from(95))

  //       const safeMaxBorrowableLeft = safeMaxBorrowable.sub(pairUserDetails[1][i].userBorrowAmount)

  //       const safeMaxBorrowableLeftPossible = pairUserDetails[1][i].totalAssetAmount.lt(
  //         safeMaxBorrowable.sub(pairUserDetails[1][i].userBorrowAmount)
  //       )
  //         ? pairUserDetails[1][i].totalAssetAmount
  //         : safeMaxBorrowable.sub(pairUserDetails[1][i].userBorrowAmount)

  //       const safeMaxRemovable = pairUserDetails[1][i].userCollateralAmount.gt(BigNumber.from(0))
  //         ? pairUserDetails[1][i].userCollateralAmount.sub(
  //             pairUserDetails[1][i].userCollateralAmount
  //               .mul(safeMaxBorrowable.sub(safeMaxBorrowableLeft))
  //               .div(safeMaxBorrowable)
  //           )
  //         : BigNumber.from(0)

  //       const utilization = currentBorrowAmount.gt(BigNumber.from(0))
  //         ? currentBorrowAmount
  //             .mul(BigNumber.from('1000000000000000000'))
  //             .div(pairUserDetails[1][i].totalAssetAmount.add(currentBorrowAmount))
  //         : BigNumber.from(0)

  //       function interestAccrue(interest: BigNumber) {
  //         if (pairUserDetails[1][i].totalBorrowAmount.eq(BigNumber.from(0))) {
  //           return STARTING_INTEREST_PER_YEAR
  //         }

  //         let currentInterest = interest

  //         const elapsedTime = BigNumber.from(Date.now())
  //           .div(BigNumber.from(1000))
  //           .sub(pairUserDetails[1][i].accrueInfo.lastAccrued)

  //         if (elapsedTime.lte(BigNumber.from(0))) {
  //           return currentInterest
  //         }

  //         if (utilization.lt(MINIMUM_TARGET_UTILIZATION)) {
  //           const underFactor = MINIMUM_TARGET_UTILIZATION.sub(utilization)
  //             .mul(FACTOR_PRECISION)
  //             .div(MINIMUM_TARGET_UTILIZATION)
  //           const scale = INTEREST_ELASTICITY.add(underFactor.mul(underFactor.mul(elapsedTime)))
  //           currentInterest = currentInterest.mul(INTEREST_ELASTICITY).div(scale)

  //           if (currentInterest.lt(MINIMUM_INTEREST_PER_YEAR)) {
  //             currentInterest = MINIMUM_INTEREST_PER_YEAR // 0.25% APR minimum
  //           }
  //         } else if (utilization.gt(MAXIMUM_TARGET_UTILIZATION)) {
  //           const overFactor = utilization
  //             .sub(MAXIMUM_TARGET_UTILIZATION)
  //             .mul(FACTOR_PRECISION.div(FULL_UTILIZATION_MINUS_MAX))
  //           const scale = INTEREST_ELASTICITY.add(overFactor.mul(overFactor.mul(elapsedTime)))
  //           currentInterest = currentInterest.mul(scale).div(INTEREST_ELASTICITY)
  //           if (currentInterest.gt(MAXIMUM_INTEREST_PER_YEAR)) {
  //             currentInterest = MAXIMUM_INTEREST_PER_YEAR // 1000% APR maximum
  //           }
  //         }
  //         return currentInterest
  //       }

  //       const interestPerYear = pairUserDetails[1][i].accrueInfo.interestPerSecond
  //         .mul(BigNumber.from(60))
  //         .mul(BigNumber.from(60))
  //         .mul(BigNumber.from(24))
  //         .mul(BigNumber.from(365))

  //       const currentInterestPerYear = interestAccrue(interestPerYear)

  //       const currentSupplyAPR = Fraction.from(
  //         takeFee(currentInterestPerYear.mul(utilization)).div(BigNumber.from(10).pow(BigNumber.from(18))),
  //         BigNumber.from(10).pow(BigNumber.from(16))
  //       ).toString()

  //       // todo: if totalAssetAmount === 0 is userAssetAmount assumed to be 0?
  //       const userSupply = pairUserDetails[1][i].totalAssetAmount.gt(BigNumber.from(0))
  //         ? pairUserDetails[1][i].userAssetAmount.add(
  //             pairUserDetails[1][i].userAssetAmount
  //               .mul(pairUserDetails[1][i].totalBorrowAmount) // change resolution by mul first!
  //               .div(pairUserDetails[1][i].totalAssetAmount)
  //           )
  //         : BigNumber.from(0)

  //       // Supply + Collateral - Borrrow
  //       const pairNetWorth =
  //         Number(Fraction.from(userSupply, BigNumber.from(10).pow(pairDetails[i].assetDecimals))) * assetUSD +
  //         Number(
  //           Fraction.from(
  //             BigNumber.from(pairUserDetails[1][i].userCollateralAmount),
  //             BigNumber.from(10).pow(pairDetails[i].collateralDecimals)
  //           ).toString()
  //         ) *
  //           collateralUSD -
  //         Number(
  //           Fraction.from(
  //             BigNumber.from(pairUserDetails[1][i].userBorrowAmount),
  //             BigNumber.from(10).pow(pairDetails[i].assetDecimals)
  //           ).toString()
  //         ) *
  //           assetUSD

  //       return {
  //         id: address,
  //         address: address,
  //         name: pairDetails[i].collateralSymbol + '-' + pairDetails[i].assetSymbol + ' MediumRiskPair',
  //         symbol: pairDetails[i].collateralSymbol + '/' + pairDetails[i].assetSymbol,
  //         currentUserBorrowAmount,
  //         maxBorrowable,
  //         safeMaxBorrowable,
  //         safeMaxBorrowableLeft,
  //         safeMaxBorrowableLeftPossible,
  //         oracle: {
  //           address: pairDetails[i].oracle,
  //           name: getOracleName(pairDetails[i].oracle),
  //           data: pairDetails[i].oracleData
  //         },
  //         collateral: {
  //           address: pairDetails[i].collateral,
  //           symbol: pairDetails[i].collateralSymbol,
  //           decimals: pairDetails[i].collateralDecimals
  //         },
  //         asset: {
  //           address: pairDetails[i].asset,
  //           symbol: pairDetails[i].assetSymbol,
  //           decimals: pairDetails[i].assetDecimals
  //         },
  //         details: {
  //           total: {
  //             collateral: {
  //               value: pairUserDetails[1][i].totalCollateralAmount,
  //               string: Fraction.from(
  //                 BigNumber.from(pairUserDetails[1][i].totalCollateralAmount),
  //                 BigNumber.from(10).pow(pairDetails[i].collateralDecimals)
  //               ).toString(),
  //               usdString:
  //                 Number(
  //                   Fraction.from(
  //                     BigNumber.from(pairUserDetails[1][i].totalCollateralAmount),
  //                     BigNumber.from(10).pow(pairDetails[i].collateralDecimals)
  //                   ).toString()
  //                 ) * collateralUSD
  //             },
  //             asset: {
  //               value: pairUserDetails[1][i].totalAssetAmount,
  //               string: Fraction.from(
  //                 BigNumber.from(pairUserDetails[1][i].totalAssetAmount),
  //                 BigNumber.from(10).pow(pairDetails[i].assetDecimals)
  //               ).toString(),
  //               usdString:
  //                 Number(
  //                   Fraction.from(
  //                     BigNumber.from(pairUserDetails[1][i].totalAssetAmount),
  //                     BigNumber.from(10).pow(pairDetails[i].assetDecimals)
  //                   ).toString()
  //                 ) * assetUSD
  //             },
  //             borrow: {
  //               value: pairUserDetails[1][i].totalBorrowAmount,
  //               string: Fraction.from(
  //                 BigNumber.from(pairUserDetails[1][i].totalBorrowAmount),
  //                 BigNumber.from(10).pow(pairDetails[i].assetDecimals)
  //               ).toString(),
  //               usdString:
  //                 Number(
  //                   Fraction.from(
  //                     BigNumber.from(pairUserDetails[1][i].totalBorrowAmount),
  //                     BigNumber.from(10).pow(pairDetails[i].assetDecimals)
  //                   ).toString()
  //                 ) * assetUSD
  //             },
  //             supply: {
  //               value: pairUserDetails[1][i].totalAssetAmount.add(pairUserDetails[1][i].totalBorrowAmount),
  //               string: Fraction.from(
  //                 pairUserDetails[1][i].totalAssetAmount.add(pairUserDetails[1][i].totalBorrowAmount),
  //                 BigNumber.from(10).pow(pairDetails[i].assetDecimals)
  //               ).toString(),
  //               usdString:
  //                 Number(
  //                   Fraction.from(
  //                     pairUserDetails[1][i].totalAssetAmount.add(pairUserDetails[1][i].totalBorrowAmount),
  //                     BigNumber.from(10).pow(pairDetails[i].assetDecimals)
  //                   ).toString()
  //                 ) * assetUSD
  //             },
  //             // utilization: total Borrow / total Assets
  //             utilization: {
  //               string:
  //                 Number(
  //                   Fraction.from(
  //                     pairUserDetails[1][i].totalBorrowAmount,
  //                     pairUserDetails[1][i].totalAssetAmount.add(pairUserDetails[1][i].totalBorrowAmount)
  //                   ).toString()
  //                 ) * 100
  //             }
  //           },
  //           rate: {
  //             current: pairUserDetails[1][i].currentExchangeRate,
  //             oracle: pairUserDetails[1][i].oracleExchangeRate
  //           },
  //           apr: {
  //             asset: pairUserDetails[1][i].assetAPR / 1e6,
  //             borrow: pairUserDetails[1][i].borrowAPR / 1e6,
  //             supplyAPR: Fraction.from(
  //               takeFee(interestPerYear.mul(utilization)).div(BigNumber.from('1000000000000000000')),
  //               BigNumber.from('10000000000000000')
  //             ).toString(),
  //             currentSupplyAPR,
  //             currentInterestPerYear: Fraction.from(currentInterestPerYear, BigNumber.from(10).pow(16)).toString(),
  //             interestPerYear: Fraction.from(interestPerYear, BigNumber.from(10).pow(16)).toString()
  //           },
  //           borrowInterestPerSecond: pairUserDetails[1][i].borrowAPR
  //         },
  //         user: {
  //           pairNetWorth: {
  //             usdString: pairNetWorth
  //           },
  //           health: {
  //             percentage: maxBorrowable.gt(BigNumber.from(0))
  //               ? Fraction.from(
  //                   currentUserBorrowAmount.mul(BigNumber.from('1000000000000000000')).div(maxBorrowable),
  //                   BigNumber.from(10).pow(16)
  //                 ).toString()
  //               : BigNumber.from(0)
  //           },
  //           collateral: {
  //             max: {
  //               value: safeMaxRemovable,
  //               balance: {
  //                 value: safeMaxRemovable,
  //                 decimals: pairDetails[i].collateralDecimals
  //               },
  //               string: Fraction.from(
  //                 safeMaxRemovable,
  //                 BigNumber.from(10).pow(pairDetails[i].collateralDecimals)
  //               ).toString()
  //             },
  //             value: pairUserDetails[1][i].userCollateralAmount,
  //             string: Fraction.from(
  //               BigNumber.from(pairUserDetails[1][i].userCollateralAmount),
  //               BigNumber.from(10).pow(pairDetails[i].collateralDecimals)
  //             ).toString(),
  //             usdString:
  //               Number(
  //                 Fraction.from(
  //                   BigNumber.from(pairUserDetails[1][i].userCollateralAmount),
  //                   BigNumber.from(10).pow(pairDetails[i].collateralDecimals)
  //                 ).toString()
  //               ) * collateralUSD,
  //             balance: {
  //               value: pairUserDetails[1][i].userCollateralAmount,
  //               decimals: pairDetails[i].collateralDecimals
  //             }
  //           },
  //           supply: {
  //             value: userSupply,
  //             string: Fraction.from(userSupply, BigNumber.from(10).pow(pairDetails[i].assetDecimals)).toString(),
  //             usdString:
  //               Number(Fraction.from(userSupply, BigNumber.from(10).pow(pairDetails[i].assetDecimals))) * assetUSD,
  //             balance: {
  //               value: userSupply,
  //               decimals: pairDetails[i].assetDecimals
  //             }
  //           },
  //           asset: {
  //             value: pairUserDetails[1][i].userAssetAmount,
  //             string: Fraction.from(
  //               BigNumber.from(pairUserDetails[1][i].userAssetAmount),
  //               BigNumber.from(10).pow(pairDetails[i].assetDecimals)
  //             ).toString(),
  //             usdString:
  //               Number(
  //                 Fraction.from(
  //                   BigNumber.from(pairUserDetails[1][i].userAssetAmount),
  //                   BigNumber.from(10).pow(pairDetails[i].assetDecimals)
  //                 ).toString()
  //               ) * assetUSD
  //           },
  //           borrow: {
  //             max: {
  //               value: safeMaxBorrowableLeftPossible,
  //               balance: {
  //                 value: safeMaxBorrowableLeftPossible,
  //                 decimals: pairDetails[i].assetDecimals
  //               },
  //               string: Fraction.from(
  //                 safeMaxBorrowableLeftPossible,
  //                 BigNumber.from(10).pow(pairDetails[i].assetDecimals)
  //               ).toString()
  //             },
  //             maxUSD:
  //               Number(
  //                 Fraction.from(
  //                   safeMaxBorrowableLeftPossible,
  //                   BigNumber.from(10).pow(pairDetails[i].assetDecimals)
  //                 ).toString()
  //               ) * assetUSD,
  //             value: pairUserDetails[1][i].userBorrowAmount,
  //             balance: {
  //               value: pairUserDetails[1][i].userBorrowAmount,
  //               decimals: pairDetails[i].assetDecimals
  //             },
  //             string: Fraction.from(
  //               BigNumber.from(pairUserDetails[1][i].userBorrowAmount),
  //               BigNumber.from(10).pow(pairDetails[i].assetDecimals)
  //             ).toString(),
  //             usdString:
  //               Number(
  //                 Fraction.from(
  //                   BigNumber.from(pairUserDetails[1][i].userBorrowAmount),
  //                   BigNumber.from(10).pow(pairDetails[i].assetDecimals)
  //                 ).toString()
  //               ) * assetUSD
  //           }
  //         }
  //       }
  //     })
  // }
  // }, [account, getPairs, kashiPairHelperContract, pairAddresses])

  // useIntervalTransaction(pollPairs, process.env.NODE_ENV !== 'production' ? 10000 : 10000)

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

  return context.state.pairs.find((pair: any) => {
    return ethers.utils.getAddress(pair.id) === ethers.utils.getAddress(id)
  })
}
