import { useActiveWeb3React } from 'hooks'
import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { useBentoBoxContract, useChainlinkOracle, useKashiPairContract } from 'sushi-hooks/useContract'
import Fraction from '../../constants/Fraction'
import { WETH, Currency, ChainId } from '@sushiswap/sdk'
import { takeFee, toElastic } from '../functions'
import { ethers } from 'ethers'
import {
  KASHI_ADDRESS,
  getCurrency
} from '../constants'
import { useBoringHelperContract } from 'hooks/useContract'
import { useDefaultTokens } from 'hooks/Tokens'
import { getOracle } from '../entities'
import useInterval from 'hooks/useInterval'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import _ from 'lodash'
import { e10, min, ZERO } from 'kashi/functions/math'
import { rpcToObj } from 'kashi/functions/utils'
import { toAmount } from 'kashi/functions/bentobox'
import { accrue, easyAmount, getUSDValue, interestAccrue } from 'kashi/functions/kashi'

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
        const allPairAddresses = logPairs
          .filter((pair: any) => getOracle(pair, chain, tokens).valid)
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

              pair.oracle = getOracle(pair, chain, tokens)
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
