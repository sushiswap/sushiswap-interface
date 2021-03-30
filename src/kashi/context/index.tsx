import { useActiveWeb3React } from 'hooks'
import React, { createContext, useContext, useReducer, useCallback, Component } from 'react'
import { useBentoBoxContract, useKashiPairContract } from 'sushi-hooks/useContract'
import Fraction from '../../constants/Fraction'
import { ChainId } from '@sushiswap/sdk'
import { takeFee, toElastic } from '../functions'
import { ethers } from 'ethers'
import {
  MINIMUM_TARGET_UTILIZATION,
  MAXIMUM_TARGET_UTILIZATION,
  FULL_UTILIZATION_MINUS_MAX,
  STARTING_INTEREST_PER_YEAR,
  MINIMUM_INTEREST_PER_YEAR,
  MAXIMUM_INTEREST_PER_YEAR,
  INTEREST_ELASTICITY,
  FACTOR_PRECISION,
  CLONE_ADDRESSES,
  KASHI_ADDRESS
} from '../constants'
import { useBoringHelperContract } from 'hooks/useContract'
import { useDefaultTokens } from 'hooks/Tokens'
import { Oracle, KashiPollPair, KashiPair } from '../entities'
import useInterval from 'hooks/useInterval'
import { BigNumber } from '@ethersproject/bignumber'

enum ActionType {
  UPDATE = 'UPDATE',
  SYNC = 'SYNC'
}

interface Reducer {
  type: ActionType
  payload: any
}

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
      // console.log('SYNC PAIRS')
      return {
        ...state
      }
    case ActionType.UPDATE:
      // console.log('UPDATE PAIRS')
      const { pairs } = action.payload
      return {
        ...state,
        pairs
      }
    default:
      return state
  }
}

// Pricing currency
const USDT_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  [ChainId.ROPSTEN]: '0x516de3a7a567d81737e3a46ec4ff9cfd1fcb0136'
}

export function KashiProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = useReducer<React.Reducer<State, Reducer>>(reducer, initialState)

  const { account, chainId } = useActiveWeb3React()

  const pairAddresses = CLONE_ADDRESSES[chainId || 1]

  const boringHelperContract = useBoringHelperContract()

  const bentoBoxContract = useBentoBoxContract()

  const kashiPairContract = useKashiPairContract()

  // Default token list fine for now, might want to more to the broader collection later.
  const tokens = useDefaultTokens()

  // TODO: Use multicall to poll by block
  // const { result, loading } = useSingleCallResult(boringHelperContract, 'pollKashiPairs', [
  //   account ?? undefined,
  //   pairAddresses
  // ])

  const updatePairs = useCallback(
    async function() {
      if (boringHelperContract && bentoBoxContract && kashiPairContract && pairAddresses) {
        const info = await boringHelperContract.getUIInfo(
          account || '0x0000000000000000000000000000000000000000',
          [],
          USDT_ADDRESS[chainId || 1],
          [KASHI_ADDRESS]
        )

        const pairs = await boringHelperContract.pollKashiPairs(account, pairAddresses)

        const tokenAddresses: string[] = Array.from(
          pairs.reduce((previousValue: Set<string>, currentValue: KashiPollPair) => {
            previousValue.add(currentValue.collateral)
            previousValue.add(currentValue.asset)
            return previousValue
          }, new Set())
        )

        const prices = await Promise.all(
          tokenAddresses
            .filter((tokenAddress: string) => tokens[tokenAddress])
            .map(async (tokenAddress: string) => {
              return {
                ...tokens[tokenAddress],
                usd: tokens[tokenAddress]
                  ? Fraction.from(
                      BigNumber.from(10)
                        .pow(BigNumber.from(tokens[tokenAddress].decimals))
                        .mul(info.ethRate)
                        .div(await boringHelperContract.getETHRate(tokenAddress.toLowerCase())),
                      BigNumber.from(10).pow(BigNumber.from(6))
                    ).toString()
                  : 0
              }
            })
        )

        console.log({ pairs })

        dispatch({
          type: ActionType.UPDATE,
          payload: {
            pairs: await Promise.all(
              pairs
                .filter((pair: KashiPollPair) => {
                  const oracle = new Oracle(pair.oracle, pair.oracleData)
                  return oracle.validate() && tokens[pair.collateral] && tokens[pair.asset]
                })
                .map(async (pair: KashiPollPair, i: number) => {
                  const {
                    accrueInfo,
                    asset,
                    collateral,
                    currentExchangeRate,
                    // oracle,
                    oracleData,
                    oracleExchangeRate,
                    spotExchangeRate,
                    totalAsset,
                    totalBorrow,
                    totalCollateralShare,
                    userAssetFraction,
                    userBorrowPart,
                    userCollateralShare
                  } = pair

                  const collateralUSD = prices.find(token => token.address === collateral)?.usd || 0

                  const assetUSD = prices.find(token => token.address === asset)?.usd || 0

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

                  const userBorrowAmount = toElastic(totalBorrow, userBorrowPart, false)

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

                  const maxBorrowableOracle = oracleExchangeRate.gt(BigNumber.from(0))
                    ? userCollateralAmount
                        .mul(BigNumber.from('1000000000000000000'))
                        .div(BigNumber.from(100))
                        .mul(BigNumber.from(75))
                        .div(oracleExchangeRate)
                    : BigNumber.from(0)

                  const maxBorrowableStored = currentExchangeRate.gt(BigNumber.from(0))
                    ? userCollateralAmount
                        .mul(BigNumber.from('1000000000000000000'))
                        .div(BigNumber.from(100))
                        .mul(BigNumber.from(75))
                        .div(currentExchangeRate)
                    : BigNumber.from(0)

                  const maxBorrowable = maxBorrowableOracle.lt(maxBorrowableStored)
                    ? maxBorrowableOracle
                    : maxBorrowableStored

                  const safeMaxBorrowable = maxBorrowable.div(BigNumber.from(100)).mul(BigNumber.from(95))

                  const safeMaxBorrowableLeft = safeMaxBorrowable.sub(userBorrowAmount)

                  const safeMaxBorrowableLeftPossible = totalAssetAmount.lt(safeMaxBorrowable.sub(userBorrowAmount))
                    ? totalAssetAmount
                    : safeMaxBorrowable.sub(userBorrowAmount)

                  const safeMaxRemovable = userCollateralAmount.gt(BigNumber.from(0))
                    ? userCollateralAmount.sub(
                        userCollateralAmount.mul(safeMaxBorrowable.sub(safeMaxBorrowableLeft)).div(safeMaxBorrowable)
                      )
                    : BigNumber.from(0)

                  const health = maxBorrowable.gt(BigNumber.from(0))
                    ? currentUserBorrowAmount.mul(BigNumber.from('1000000000000000000')).div(maxBorrowable)
                    : BigNumber.from(0)

                  const liquidity = totalAssetAmount.add(totalBorrowAmount)

                  const userTotalSupply = totalAssetAmount.gt(BigNumber.from(0))
                    ? userAssetAmount.add(userAssetAmount.mul(totalBorrowAmount).div(totalAssetAmount))
                    : BigNumber.from(0)

                  const userNetWorth =
                    Number(
                      Fraction.from(userTotalSupply, BigNumber.from(10).pow(BigNumber.from(tokens[asset].decimals)))
                    ) *
                      Number(assetUSD) +
                    Number(
                      Fraction.from(
                        BigNumber.from(userCollateralAmount),
                        BigNumber.from(10).pow(BigNumber.from(tokens[collateral].decimals))
                      ).toString()
                    ) *
                      Number(collateralUSD) -
                    Number(
                      Fraction.from(
                        BigNumber.from(userBorrowAmount),
                        BigNumber.from(10).pow(BigNumber.from(tokens[asset].decimals))
                      ).toString()
                    ) *
                      Number(assetUSD)

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
                    oracle: new Oracle(pair.oracle, pair.oracleData),
                    // oracle,
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
                    totalCollateralAmount: {
                      value: totalCollateralAmount,
                      string: Fraction.from(
                        totalCollateralAmount,
                        BigNumber.from(10).pow(BigNumber.from(tokens[collateral].decimals))
                      ).toString()
                    },
                    userCollateralAmount: {
                      value: userCollateralAmount,
                      string: Fraction.from(
                        userCollateralAmount,
                        BigNumber.from(10).pow(BigNumber.from(tokens[collateral].decimals))
                      ).toString()
                    },
                    totalAssetAmount: {
                      value: totalAssetAmount,
                      string: Fraction.from(
                        totalAssetAmount,
                        BigNumber.from(10).pow(BigNumber.from(tokens[asset].decimals))
                      ).toString(),
                      usd:
                        Number(
                          Fraction.from(
                            totalAssetAmount,
                            BigNumber.from(10).pow(BigNumber.from(tokens[asset].decimals))
                          ).toString()
                        ) * Number(assetUSD)
                    },
                    userAssetAmount: {
                      value: userAssetAmount,
                      string: Fraction.from(
                        userAssetAmount,
                        BigNumber.from(10).pow(BigNumber.from(tokens[asset].decimals))
                      ).toString()
                    },
                    totalBorrowAmount: {
                      value: totalBorrowAmount,
                      string: Fraction.from(
                        totalBorrowAmount,
                        BigNumber.from(10).pow(BigNumber.from(tokens[asset].decimals))
                      ).toString()
                    },
                    userBorrowAmount: {
                      value: userBorrowAmount,
                      string: Fraction.from(
                        userBorrowAmount,
                        BigNumber.from(10).pow(BigNumber.from(tokens[asset].decimals))
                      ).toString()
                    },
                    currentBorrowAmount: {
                      value: currentBorrowAmount,
                      string: Fraction.from(
                        currentBorrowAmount,
                        BigNumber.from(10).pow(BigNumber.from(tokens[asset].decimals))
                      ).toString()
                    },
                    currentUserBorrowAmount: {
                      value: currentUserBorrowAmount,
                      string: Fraction.from(
                        currentUserBorrowAmount,
                        BigNumber.from(10).pow(BigNumber.from(tokens[asset].decimals))
                      ).toString()
                    },
                    currentSupplyAPR: {
                      value: currentSupplyAPR,
                      string: Fraction.from(currentSupplyAPR, BigNumber.from(10).pow(BigNumber.from(16))).toString()
                    },
                    currentInterestPerYear: {
                      value: currentInterestPerYear,
                      string: Fraction.from(currentInterestPerYear, BigNumber.from(10).pow(16)).toString()
                    },
                    utilization: {
                      value: utilization,
                      string: Fraction.from(utilization, BigNumber.from(10).pow(16)).toString()
                    },
                    liquidity: {
                      value: liquidity,
                      string: Fraction.from(
                        liquidity,
                        BigNumber.from(10).pow(BigNumber.from(tokens[asset].decimals))
                      ).toString(),
                      usd:
                        Number(
                          Fraction.from(
                            liquidity,
                            BigNumber.from(10).pow(BigNumber.from(tokens[asset].decimals))
                          ).toString()
                        ) * Number(assetUSD)
                    },

                    userNetWorth,

                    userTotalSupply: {
                      value: userTotalSupply,
                      string: Fraction.from(
                        userTotalSupply,
                        BigNumber.from(10).pow(BigNumber.from(tokens[asset].decimals))
                      ).toString()
                    },

                    health: {
                      value: health,
                      string: Fraction.from(health, BigNumber.from(10).pow(16))
                    },

                    maxBorrowableOracle: {
                      value: maxBorrowableOracle
                    },

                    maxBorrowableStored: {
                      value: maxBorrowableStored
                    },

                    maxBorrowable: {
                      value: maxBorrowable
                    },

                    safeMaxBorrowable: {
                      value: safeMaxBorrowable
                    },

                    safeMaxBorrowableLeft: {
                      value: safeMaxBorrowableLeft,
                      string: Fraction.from(
                        safeMaxBorrowableLeft,
                        BigNumber.from(10).pow(BigNumber.from(tokens[asset].decimals))
                      )
                    },

                    safeMaxBorrowableLeftPossible: {
                      value: safeMaxBorrowableLeftPossible,
                      string: Fraction.from(
                        safeMaxBorrowableLeftPossible,
                        BigNumber.from(10).pow(BigNumber.from(tokens[asset].decimals))
                      )
                    },

                    safeMaxRemovable: {
                      value: safeMaxRemovable,
                      string: Fraction.from(
                        safeMaxRemovable,
                        BigNumber.from(10).pow(tokens[collateral].decimals)
                      ).toString()
                    }
                  }
                })
            )
          }
        })
      }
    },
    [boringHelperContract, bentoBoxContract, chainId, kashiPairContract, account, pairAddresses, tokens]
  )

  useInterval(updatePairs, 10000)

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

export function useKashiPair(address: string) {
  const context = useContext(KashiContext)
  if (context === undefined) {
    throw new Error('useKashiPair must be used within a KashiProvider')
  }
  return context.state.pairs.find((pair: any) => {
    return ethers.utils.getAddress(pair.address) === ethers.utils.getAddress(address)
  })
}
