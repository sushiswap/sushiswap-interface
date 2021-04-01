import { useActiveWeb3React } from 'hooks'
import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { useBentoBoxContract, useChainlinkOracle, useKashiPairContract } from 'sushi-hooks/useContract'
import Fraction from '../../constants/Fraction'
import { WETH, Currency } from '@sushiswap/sdk'
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
  KASHI_ADDRESS,
  CHAINLINK_MAPPING,
  getCurrency
} from '../constants'
import { useBoringHelperContract } from 'hooks/useContract'
import { useDefaultTokens } from 'hooks/Tokens'
import { Oracle, KashiPollPair, KashiPair } from '../entities'
import useInterval from 'hooks/useInterval'
import { BigNumber } from '@ethersproject/bignumber'
import _ from 'lodash'

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

function ChainOracleVerify(pair: any, tokens: any) {
  const params = ethers.utils.defaultAbiCoder.decode(['address', 'address', 'uint256'], pair.oracleData)
  let decimals = BigInt('54')
  let from = ''
  let to = ''
  if (params[0] != ethers.constants.AddressZero) {
    if (!CHAINLINK_MAPPING[params[0]]) {
      console.log('One of the Chainlink oracles used is not configured in this UI.')
      return false // One of the Chainlink oracles used is not configured in this UI.
    } else {
      decimals -= BigInt('18') - CHAINLINK_MAPPING[params[0]].decimals
      from = CHAINLINK_MAPPING[params[0]].from
      to = CHAINLINK_MAPPING[params[0]].to
    }
  }
  if (params[1] != ethers.constants.AddressZero) {
    if (!CHAINLINK_MAPPING[params[1]]) {
      console.log('One of the Chainlink oracles used is not configured in this UI.')
      return false // One of the Chainlink oracles used is not configured in this UI.
    } else {
      decimals -= CHAINLINK_MAPPING[params[1]].decimals
      if (!to) {
        from = CHAINLINK_MAPPING[params[1]].to
        to = CHAINLINK_MAPPING[params[1]].from
      } else if (to == CHAINLINK_MAPPING[params[1]].to) {
        to = CHAINLINK_MAPPING[params[1]].from
      } else {
        return false // The Chainlink oracles used don't match up with eachother. If 2 oracles are used, they should have a common token, such as WBTC/ETH and LINK/ETH, where ETH is the common link.
      }
    }
  }
  if (from == pair.assetAddress.toLowerCase() && to == pair.collateralAddress.toLowerCase() && tokens[pair.collateralAddress] && tokens[pair.assetAddress]) {
    const needed = BigInt(tokens[pair.collateralAddress].decimals + 18 - tokens[pair.assetAddress].decimals)
    const divider = BigNumber.from(10).pow(BigNumber.from(decimals - needed))
    if (!divider.eq(params[2])) {
      console.log(
        'The divider parameter is misconfigured for this oracle, which leads to rates that are order(s) of magnitude wrong.',
        divider.toString(),
        params[2].toString(),
        tokens[pair.collateralAddress].decimals
      )
      return false // The divider parameter is misconfigured for this oracle, which leads to rates that are order(s) of magnitude wrong.
    } else {
      return true
    }
  } else {
    console.log("The Chainlink oracles configured don't match the pair tokens.")
    return false // The Chainlink oracles configured don't match the pair tokens.
  }
}

function GetPairsFromLogs(logs: any) {
  return logs.map((log: any) => {
    const deployParams = ethers.utils.defaultAbiCoder.decode(
      ['address', 'address', 'address', 'bytes'],
      log.args?.data
    )
    return {
      masterContract: log.args?.masterContract,
      address: log.args?.cloneAddress,
      collateralAddress: deployParams[0],
      assetAddress: deployParams[1],
      oracle: deployParams[2],
      oracleData: deployParams[3]      
    }
  })
}

function e10(exponent: BigNumber | Number | string) {
  return BigNumber.from("10").pow(BigNumber.from(exponent))
}

export function KashiProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = useReducer<React.Reducer<State, Reducer>>(reducer, initialState)

  const { account, chainId } = useActiveWeb3React()

  const boringHelperContract = useBoringHelperContract()
  const bentoBoxContract = useBentoBoxContract()
  const kashiPairContract = useKashiPairContract()
  const chainlinkOracleContract = useChainlinkOracle()

  // Default token list fine for now, might want to more to the broader collection later.
  const tokens = useDefaultTokens()
  console.log(tokens)

  const updatePairs = useCallback(
    async function() {
      if (boringHelperContract && bentoBoxContract && kashiPairContract) {
        const info = await boringHelperContract.getUIInfo(
          account || ethers.constants.AddressZero,
          [],
          getCurrency(chainId).address,
          [KASHI_ADDRESS]
        )

        const logPairs = GetPairsFromLogs(await bentoBoxContract.queryFilter(bentoBoxContract.filters.LogDeploy(KASHI_ADDRESS)))

        const supported_oracles = [chainlinkOracleContract?.address]
        const pairAddresses = (logPairs).filter((pair: any) => 
          supported_oracles.indexOf(pair.oracle) != -1 && 
          ChainOracleVerify(pair, tokens)
        ).map((pair: any) => pair.address)

        const pairs = await boringHelperContract.pollKashiPairs(account, pairAddresses)

        const tokenAddresses: string[] = _.uniq(
          pairs.map((pair: KashiPollPair) => pair.collateral).concat(pairs.map((pair: KashiPollPair) => pair.asset))
        )

        const balances = await boringHelperContract.getBalances(account, tokenAddresses)

        const prices = balances
          .filter((balance: any) => tokens[balance.token])
          .map((balance: any) => {
            return {
              ...tokens[balance.token],
              usd: e10(tokens[balance.token].decimals).mul(info.ethRate).div(balance.rate).div(e10(getCurrency(chainId).decimals)).toString()
            }
          })

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

                  const collateralUSD = prices.find((token: any) => token.address === collateral)?.usd || 0

                  const assetUSD = prices.find((token: any) => token.address === asset)?.usd || 0

                  const totalCollateralAmount = await bentoBoxContract.toAmount(collateral, totalCollateralShare, false)

                  const userCollateralAmount = await bentoBoxContract.toAmount(collateral, userCollateralShare, false)

                  const totalAssetAmount = await bentoBoxContract.toAmount(asset, totalAsset.elastic, false)

                  // TODO: Convert from shares to amount
                  const userAssetAmount = toElastic(totalAsset, userAssetFraction, false)

                  const totalBorrowAmount = totalBorrow.elastic.eq(BigNumber.from(0))
                    ? BigNumber.from(0)
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
                    address: pairAddresses[i].address,
                    accrueInfo: {
                      feesEarnedFraction: accrueInfo.feesEarnedFraction,
                      interestPerSecond: accrueInfo.interestPerSecond,
                      lastAccrued: accrueInfo.lastAccrued
                    },
                    asset: {
                      ...tokens[asset],
                      symbol:
                        tokens[asset].address === WETH[chainId || 1].address
                          ? Currency.getNativeCurrencySymbol(chainId)
                          : tokens[asset].symbol
                    },
                    collateral: {
                      ...tokens[collateral],
                      symbol:
                        tokens[collateral].address === WETH[chainId || 1].address
                          ? Currency.getNativeCurrencySymbol(chainId)
                          : tokens[collateral].symbol
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
                      ).toString(),
                      usd:
                        Number(
                          Fraction.from(
                            userAssetAmount,
                            BigNumber.from(10).pow(BigNumber.from(tokens[asset].decimals))
                          ).toString()
                        ) * Number(assetUSD)                   
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
    [boringHelperContract, bentoBoxContract, chainId, kashiPairContract, account, tokens]
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
