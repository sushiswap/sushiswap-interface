import { useActiveWeb3React } from 'hooks'
import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { useBentoBoxContract, useChainlinkOracle, useKashiPairContract } from 'sushi-hooks/useContract'
import Fraction from '../../constants/Fraction'
import { WETH, Currency, ChainId } from '@sushiswap/sdk'
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
import { Oracle } from '../entities'
import useInterval from 'hooks/useInterval'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import _ from 'lodash'
import { e10, min, ZERO } from 'kashi/functions/math'

enum ActionType {
  UPDATE = 'UPDATE',
  SYNC = 'SYNC'
}

interface Reducer {
  type: ActionType
  payload: any
}

interface State {
  markets: number
  pairs: any[]
}

const initialState: State = {
  markets: 0,
  pairs: []
}

export interface KashiContextProps {
  state: State
  dispatch: React.Dispatch<any>
}

type KashiProviderProps = {
  state: State
  dispatch: React.Dispatch<any>
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

function ChainOracleVerify(chain: ChainId, pair: any, tokens: any) {
  const mapping = CHAINLINK_MAPPING[chain]
  if (!mapping) {
    return false
  }
  const params = ethers.utils.defaultAbiCoder.decode(['address', 'address', 'uint256'], pair.oracleData)
  let decimals = 54
  let from = ''
  let to = ''
  if (params[0] != ethers.constants.AddressZero) {
    if (!mapping![params[0]]) {
      console.log('One of the Chainlink oracles used is not configured in this UI.')
      return false // One of the Chainlink oracles used is not configured in this UI.
    } else {
      decimals -= 18 - mapping![params[0]].decimals
      from = mapping![params[0]].from
      to = mapping![params[0]].to
    }
  }
  if (params[1] != ethers.constants.AddressZero) {
    if (!mapping![params[1]]) {
      console.log('One of the Chainlink oracles used is not configured in this UI.')
      return false // One of the Chainlink oracles used is not configured in this UI.
    } else {
      decimals -= mapping![params[1]].decimals
      if (!to) {
        from = mapping![params[1]].to
        to = mapping![params[1]].from
      } else if (to == mapping![params[1]].to) {
        to = mapping![params[1]].from
      } else {
        console.log(
          "The Chainlink oracles used don't match up with eachother. If 2 oracles are used, they should have a common token, such as WBTC/ETH and LINK/ETH, where ETH is the common link."
        )
        return false // The Chainlink oracles used don't match up with eachother. If 2 oracles are used, they should have a common token, such as WBTC/ETH and LINK/ETH, where ETH is the common link.
      }
    }
  }
  if (
    from == pair.assetAddress &&
    to == pair.collateralAddress &&
    tokens[pair.collateralAddress] &&
    tokens[pair.assetAddress]
  ) {
    const needed = tokens[pair.collateralAddress].decimals + 18 - tokens[pair.assetAddress].decimals
    const divider = BigNumber.from(10).pow(BigNumber.from(decimals - needed))
    if (!divider.eq(params[2])) {
      console.log(
        'The divider parameter is misconfigured for this oracle, which leads to rates that are order(s) of magnitude wrong.'
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
    const deployParams = ethers.utils.defaultAbiCoder.decode(['address', 'address', 'address', 'bytes'], log.args?.data)
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

function rpcToObj(rpc_obj: any, obj?: any) {
  if (rpc_obj instanceof ethers.BigNumber) {
    return rpc_obj
  }
  if (!obj) {
    obj = {}
  }
  if (typeof rpc_obj == 'object') {
    if (Object.keys(rpc_obj).length && isNaN(Number(Object.keys(rpc_obj)[Object.keys(rpc_obj).length - 1]))) {
      for (let i in rpc_obj) {
        if (isNaN(Number(i))) {
          obj[i] = rpcToObj(rpc_obj[i])
        }
      }
      return obj
    }
    return rpc_obj.map((item: any) => rpcToObj(item))
  }
  return rpc_obj
}

function toAmount(token: any, shares: BigNumber) {
  return shares.muldiv(token.bentoAmount, token.bentoShare)
}
function toShare(token: any, shares: BigNumber) {
  return shares.muldiv(token.bentoShare, token.bentoAmount)
}
function accrue(pair: any, amount: BigNumber) {
  return amount
    .mul(pair.accrueInfo.interestPerSecond)
    .mul(pair.elapsedSeconds)
    .div(e10(18))
}
function interestAccrue(pair: any, interest: BigNumber) {
  if (pair.totalBorrowAmount.eq(0)) {
    return STARTING_INTEREST_PER_YEAR
  }
  if (pair.elapsedSeconds.lte(0)) {
    return interest
  }

  let currentInterest = interest
  if (pair.utilization.lt(MINIMUM_TARGET_UTILIZATION)) {
    const underFactor = MINIMUM_TARGET_UTILIZATION.sub(pair.utilization).muldiv(
      FACTOR_PRECISION,
      MINIMUM_TARGET_UTILIZATION
    )
    const scale = INTEREST_ELASTICITY.add(underFactor.mul(underFactor).mul(pair.elapsedSeconds))
    currentInterest = currentInterest.mul(INTEREST_ELASTICITY).div(scale)

    if (currentInterest.lt(MINIMUM_INTEREST_PER_YEAR)) {
      currentInterest = MINIMUM_INTEREST_PER_YEAR // 0.25% APR minimum
    }
  } else if (pair.utilization.gt(MAXIMUM_TARGET_UTILIZATION)) {
    const overFactor = pair.utilization
      .sub(MAXIMUM_TARGET_UTILIZATION)
      .mul(FACTOR_PRECISION.div(FULL_UTILIZATION_MINUS_MAX))
    const scale = INTEREST_ELASTICITY.add(overFactor.mul(overFactor).mul(pair.elapsedSeconds))
    currentInterest = currentInterest.mul(scale).div(INTEREST_ELASTICITY)
    if (currentInterest.gt(MAXIMUM_INTEREST_PER_YEAR)) {
      currentInterest = MAXIMUM_INTEREST_PER_YEAR // 1000% APR maximum
    }
  }
  return currentInterest
}
function getUSDValue(amount: BigNumberish, token: any) {
  return BigNumber.from(amount)
    .mul(token.usd)
    .div(e10(token.decimals))
}
function easyAmount(amount: BigNumber, token: any) {
  return {
    value: amount,
    string: Fraction.from(amount, e10(token.decimals)).toString(),
    usd: Fraction.from(getUSDValue(amount, token), e10(6)).toString()
  }
}
class Tokens extends Array {
  add(address: any) {
    if (!this[address]) {
      this[address] = { address: address }
    }
    return this[address]
  }
}

export function KashiProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = useReducer<React.Reducer<State, Reducer>>(reducer, initialState)

  let { account, chainId } = useActiveWeb3React()
  const chain: ChainId = chainId || 1
  const weth = WETH[chain].address
  const curreny: any = getCurrency(chain).address

  const boringHelperContract = useBoringHelperContract()
  const bentoBoxContract = useBentoBoxContract()
  const chainlinkOracleContract = useChainlinkOracle()

  // Default token list fine for now, might want to more to the broader collection later.
  const tokens = useDefaultTokens()

  const updatePairs = useCallback(
    async function() {
      if (boringHelperContract && bentoBoxContract) {
        // Get the deployed pairs from the logs and decode
        const logPairs = GetPairsFromLogs(
          await bentoBoxContract.queryFilter(bentoBoxContract.filters.LogDeploy(KASHI_ADDRESS))
        )

        // Filter all pairs by supported oracles and verify the oracle setup
        const supported_oracles = [chainlinkOracleContract?.address]
        const allPairAddresses = logPairs
          .filter((pair: any) => supported_oracles.indexOf(pair.oracle) != -1 && ChainOracleVerify(chain, pair, tokens))
          .map((pair: any) => pair.address)

        // Get full info on all the verified pairs
        const pairs = rpcToObj(await boringHelperContract.pollKashiPairs(account, allPairAddresses))

        // Get a list of all tokens in the pairs
        const pairTokens = new Tokens()
        pairTokens.add(curreny)

        pairs.forEach((pair: any, i: number) => {
          pair.address = allPairAddresses[i]
          pair.collateral = pairTokens.add(pair.collateral)
          pair.asset = pairTokens.add(pair.asset)
        })

        // Get balances, bentobox info and allowences for the tokens
        const pairAddresses = Object.values(pairTokens).map((token: any) => token.address)
        const balances = rpcToObj(await boringHelperContract.getBalances(account, pairAddresses))
        const missingTokens: any[] = []
        balances.forEach((balance: any, i: number) => {
          if (tokens[balance.token]) {
            Object.assign(pairTokens[balance.token], tokens[balance.token])
          } else {
            missingTokens.push(balance.token)
          }
          Object.assign(pairTokens[balance.token], balance)
        })

        // For any tokens that are not on the defaultTokenList, retrieve name, symbol, decimals, etc.
        if (missingTokens.length) {
          // TODO
        }

        // Calculate the USD price for each token
        Object.values(pairTokens).forEach((token: any) => {
          token.symbol = token.address === weth ? Currency.getNativeCurrencySymbol(chain) : token.symbol
          token.usd = e10(token.decimals).muldiv(pairTokens[curreny].rate, token.rate)
        })

        dispatch({
          type: ActionType.UPDATE,
          payload: {
            pairs: pairs.map((pair: any, i: number) => {
              pair.elapsedSeconds = BigNumber.from(Date.now())
                .div('1000')
                .sub(pair.accrueInfo.lastAccrued)

              // Interest per year at last accrue, this will apply during the next accrue
              pair.interestPerYear = pair.accrueInfo.interestPerSecond
                .mul('60')
                .mul('60')
                .mul('24')
                .mul('365')

              // The total collateral in the market (stable, doesn't accrue)
              pair.totalCollateralAmount = toAmount(pair.collateral, pair.totalCollateralShare)

              // The total assets unborrowed in the market (stable, doesn't accrue)
              pair.totalAssetAmount = toAmount(pair.asset, pair.totalAsset.elastic)

              // The total assets borrowed in the market at last accrue (accrues over time)
              pair.totalBorrowAmount = pair.totalBorrow.elastic

              // The total assets borrowed in the market right now
              pair.currentBorrowAmount = pair.totalBorrowAmount.add(accrue(pair, pair.totalBorrowAmount))

              // The total amount of assets, both borrowed and still available right now
              pair.currentAllAssets = pair.totalAssetAmount.add(pair.currentBorrowAmount)
              pair.liquidity = pair.totalAssetAmount.add(pair.totalBorrowAmount)

              // The percentage of assets that is borrowed out right now
              pair.utilization = e10(18).muldiv(pair.currentBorrowAmount, pair.currentAllAssets)

              // Interest payable by borrowers per year as of now
              pair.currentInterestPerYear = interestAccrue(pair, pair.interestPerYear)

              // Interest per year received by lenders as of now
              pair.currentSupplyAPR = takeFee(pair.currentInterestPerYear.muldiv(pair.utilization, e10(18)))

              pair.userCollateralAmount = toAmount(pair.collateral, pair.userCollateralShare)
              pair.userAssetAmount = toAmount(pair.asset, toElastic(pair.totalAsset, pair.userAssetFraction, false))
              pair.userBorrowAmount = toElastic(pair.totalBorrow, pair.userBorrowPart, false)

              pair.currentUserBorrowAmount = pair.userBorrowAmount.add(takeFee(accrue(pair, pair.userBorrowAmount)))

              pair.maxBorrowableOracle = pair.userCollateralAmount.muldiv(e10(16).mul('75'), pair.oracleExchangeRate)
              pair.maxBorrowableStored = pair.userCollateralAmount.muldiv(e10(16).mul('75'), pair.currentExchangeRate)
              pair.maxBorrowable = min(pair.maxBorrowableOracle, pair.maxBorrowableStored)
              pair.safeMaxBorrowable = pair.maxBorrowable.muldiv('95', '100')
              pair.safeMaxBorrowableLeft = pair.safeMaxBorrowable.sub(pair.userBorrowAmount)
              pair.safeMaxBorrowableLeftPossible = min(pair.safeMaxBorrowableLeft, pair.totalAssetAmount)
              pair.safeMaxRemovable = ZERO

              pair.health = pair.currentUserBorrowAmount.muldiv(e10(18), pair.maxBorrowable)

              pair.userTotalSupply = pair.userAssetAmount.add(
                pair.userAssetAmount.muldiv(pair.totalBorrowAmount, pair.totalAssetAmount)
              )
              pair.userNetWorth = getUSDValue(pair.userAssetAmount.sub(pair.currentUserBorrowAmount), pair.asset)
              pair.search = pair.collateral.symbol + '/' + pair.asset.symbol

              pair.oracle = new Oracle(pair.oracle, pair.oracleData)
              pair.totalCollateralAmount = easyAmount(pair.totalCollateralAmount, pair.collateral)
              pair.userCollateralAmount = easyAmount(pair.userCollateralAmount, pair.collateral)
              pair.totalAssetAmount = easyAmount(pair.totalAssetAmount, pair.asset)
              pair.userAssetAmount = easyAmount(pair.userAssetAmount, pair.asset)
              pair.totalBorrowAmount = easyAmount(pair.totalBorrowAmount, pair.asset)
              pair.userBorrowAmount = easyAmount(pair.userBorrowAmount, pair.asset)
              pair.currentBorrowAmount = easyAmount(pair.currentBorrowAmount, pair.asset)
              pair.currentUserBorrowAmount = easyAmount(pair.currentUserBorrowAmount, pair.asset)
              pair.currentAllAssets = easyAmount(pair.currentAllAssets, pair.asset)
              pair.currentSupplyAPR = {
                value: pair.currentSupplyAPR,
                string: Fraction.from(pair.currentSupplyAPR, BigNumber.from(10).pow(BigNumber.from(16))).toString()
              }
              pair.currentInterestPerYear = {
                value: pair.currentInterestPerYear,
                string: Fraction.from(pair.currentInterestPerYear, BigNumber.from(10).pow(16)).toString()
              }
              pair.utilization = {
                value: pair.utilization,
                string: Fraction.from(pair.utilization, BigNumber.from(10).pow(16)).toString()
              }
              pair.liquidity = easyAmount(pair.liquidity, pair.asset)
              pair.userTotalSupply = easyAmount(pair.userTotalSupply, pair.asset)
              pair.health = {
                value: pair.health,
                string: Fraction.from(pair.health, e10(16))
              }
              pair.maxBorrowableOracle = easyAmount(pair.maxBorrowableOracle, pair.asset)
              pair.maxBorrowableStored = easyAmount(pair.maxBorrowableStored, pair.asset)
              pair.maxBorrowable = easyAmount(pair.maxBorrowable, pair.asset)
              pair.safeMaxBorrowable = easyAmount(pair.safeMaxBorrowable, pair.asset)
              pair.safeMaxBorrowableLeft = easyAmount(pair.safeMaxBorrowableLeft, pair.asset)
              pair.safeMaxBorrowableLeftPossible = easyAmount(pair.safeMaxBorrowableLeftPossible, pair.asset)
              pair.safeMaxRemovable = easyAmount(pair.safeMaxRemovable, pair.collateral)

              return pair
            })
          }
        })
      }
    },
    [boringHelperContract, bentoBoxContract, chainId, chain, account, tokens]
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

// export function withKashi<P extends object>(Component: React.ComponentType<P>): React.FC<Omit<P, keyof State>> {
//   return function WrappedWithKashi(props) {
//     return (
//       <KashiContext.Consumer>
//         {(value: KashiProviderProps) => <Component {...(props as P)} value={value} />}
//       </KashiContext.Consumer>
//     )
//   }
// }
