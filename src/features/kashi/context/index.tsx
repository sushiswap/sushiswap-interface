import { ChainId, Currency, KASHI_ADDRESS, NATIVE, Token, WNATIVE } from '@sushiswap/sdk'
import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react'
import { ZERO, e10, maximum, minimum } from '../../../functions/math'
import {
  accrue,
  accrueTotalAssetWithFee,
  easyAmount,
  getUSDValue,
  interestAccrue,
  takeFee,
} from '../../../functions/kashi'
import { toAmount, toShare } from '../../../functions/bentobox'
import { useBentoBoxContract, useBoringHelperContract } from '../../../hooks/useContract'

import { BigNumber } from '@ethersproject/bignumber'
import Fraction from '../../../entities/Fraction'
import { USDC } from '../../../hooks'
import { bentobox } from '@sushiswap/sushi-data'
import { defaultAbiCoder } from '@ethersproject/abi'
import { getAddress } from '@ethersproject/address'
import { getCurrency } from '../../../functions/currency'
import { getOracle } from '../../../entities/Oracle'
import { toElastic } from '../../../functions/rebase'
import { useActiveWeb3React } from '../../../hooks/useActiveWeb3React'
import { useAllTokens } from '../../../hooks/Tokens'
import { useBlockNumber } from '../../../state/application/hooks'
import usePrevious from '../../../hooks/usePrevious'
import { useSingleCallResult } from '../../../state/multicall/hooks'

enum ActionType {
  UPDATE = 'UPDATE',
  SYNC = 'SYNC',
}

interface Reducer {
  type: ActionType
  payload: any
}

interface State {
  info:
    | {
        ethBalance: BigNumber
        sushiBalance: BigNumber
        sushiBarBalance: BigNumber
        xsushiBalance: BigNumber
        xsushiSupply: BigNumber
        sushiBarAllowance: BigNumber
        factories: any[]
        ethRate: BigNumber
        sushiRate: BigNumber
        btcRate: BigNumber
        pendingSushi: BigNumber
        blockTimeStamp: BigNumber
        masterContractApproved: boolean[]
      }
    | undefined
  pairs: any[]
}

const initialState: State = {
  info: {
    ethBalance: ZERO,
    sushiBalance: ZERO,
    sushiBarBalance: ZERO,
    xsushiBalance: ZERO,
    xsushiSupply: ZERO,
    sushiBarAllowance: ZERO,
    factories: [],
    ethRate: ZERO,
    sushiRate: ZERO,
    btcRate: ZERO,
    pendingSushi: ZERO,
    blockTimeStamp: ZERO,
    masterContractApproved: [],
  },
  pairs: [],
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
  dispatch: () => null,
})

const reducer: React.Reducer<State, Reducer> = (state: any, action: any) => {
  switch (action.type) {
    case ActionType.SYNC:
      return {
        ...state,
      }
    case ActionType.UPDATE:
      const { info, pairs } = action.payload
      return {
        ...state,
        info,
        pairs,
      }
    default:
      return state
  }
}

async function getPairs(bentoBoxContract: any, chainId: ChainId) {
  let logs = []
  let success = false
  const masterAddress = KASHI_ADDRESS[chainId]
  if (chainId !== ChainId.BSC && chainId !== ChainId.MATIC) {
    logs = await bentoBoxContract.queryFilter(bentoBoxContract.filters.LogDeploy(masterAddress))
    success = true
  }
  if (!success) {
    logs = (
      (await bentobox.clones({
        masterAddress,
        chainId,
      })) as any
    ).map((clone: any) => {
      return {
        args: {
          masterContract: masterAddress,
          cloneAddress: clone.address,
          data: clone.data,
        },
      }
    })
  }

  return logs.map((log: any) => {
    const deployParams = defaultAbiCoder.decode(['address', 'address', 'address', 'bytes'], log.args?.data)
    return {
      masterContract: log.args?.masterContract,
      address: log.args?.cloneAddress,
      collateralAddress: deployParams[0],
      assetAddress: deployParams[1],
      oracle: deployParams[2],
      oracleData: deployParams[3],
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

export function rpcToObj(rpc_obj: any, obj?: any) {
  if (rpc_obj instanceof BigNumber) {
    return rpc_obj
  }
  if (!obj) {
    obj = {}
  }
  if (typeof rpc_obj === 'object') {
    if (Object.keys(rpc_obj).length && isNaN(Number(Object.keys(rpc_obj)[Object.keys(rpc_obj).length - 1]))) {
      for (const i in rpc_obj) {
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

export function KashiProvider({ children }) {
  const [state, dispatch] = useReducer<React.Reducer<State, Reducer>>(reducer, initialState)
  const blockNumber = useBlockNumber()

  const { account, chainId } = useActiveWeb3React()

  const weth = WNATIVE[chainId]

  const currency = USDC[chainId]

  const boringHelperContract = useBoringHelperContract()
  const bentoBoxContract = useBentoBoxContract()

  const tokens = useAllTokens()

  // const info = useSingleCallResult(boringHelperContract, 'getUIInfo', [
  //   account,
  //   [],
  //   USDC[chainId].address,
  //   [KASHI_ADDRESS[chainId]],
  // ])?.result?.[0]

  // console.log({ info })

  const updatePairs = useCallback(async () => {
    console.log('update pairs')
    if (
      !account ||
      !chainId ||
      ![ChainId.MAINNET, ChainId.KOVAN, ChainId.BSC, ChainId.MATIC, ChainId.XDAI].includes(chainId)
    ) {
      return
    }

    if (boringHelperContract && bentoBoxContract) {
      // // console.log('READY TO RUMBLE')
      const info = rpcToObj(
        await boringHelperContract.getUIInfo(account, [], currency.address, [KASHI_ADDRESS[chainId]])
      )

      // Get the deployed pairs from the logs and decode
      const logPairs = await getPairs(bentoBoxContract, chainId)
      console.log({ logPairs })

      // Filter all pairs by supported oracles and verify the oracle setup

      const invalidOracles: any = []

      const allPairAddresses = logPairs
        .filter((pair: any) => {
          const oracle = getOracle(pair, chainId, tokens)
          if (!oracle.valid) {
            // console.log(pair, oracle.valid, oracle.error)
            invalidOracles.push({ pair, error: oracle.error })
          }
          return oracle.valid
        })
        .map((pair: any) => pair.address)

      console.log('invalidOracles', invalidOracles)

      // Get full info on all the verified pairs
      const pairs = rpcToObj(await boringHelperContract.pollKashiPairs(account, allPairAddresses))

      // Get a list of all tokens in the pairs
      const pairTokens = new Tokens()

      pairTokens.add(currency.address)

      pairs.forEach((pair, i: number) => {
        pair.address = allPairAddresses[i]
        pair.collateral = pairTokens.add(pair.collateral)
        pair.asset = pairTokens.add(pair.asset)
      })

      // Get balances, bentobox info and allowences for the tokens
      const pairAddresses = Object.values(pairTokens).map((token) => token.address)
      const balances = rpcToObj(await boringHelperContract.getBalances(account, pairAddresses))

      const missingTokens = []

      balances.forEach((balance, i: number) => {
        if (tokens[balance.token]) {
          Object.assign(pairTokens[balance.token], tokens[balance.token])
        } else {
          missingTokens.push(balance.token)
        }
        Object.assign(pairTokens[balance.token], balance)
      })

      // For any tokens that are not on the defaultTokenList, retrieve name, symbol, decimals, etc.
      if (missingTokens.length) {
        console.log('missing tokens length', missingTokens.length)
        // TODO
      }

      // Calculate the USD price for each token
      Object.values(pairTokens).forEach((token) => {
        token.symbol = token.address === weth.address ? NATIVE[chainId].symbol : token.tokenInfo.symbol
        token.usd = e10(token.tokenInfo.decimals).mulDiv(pairTokens[currency.address].rate, token.rate)
      })

      dispatch({
        type: ActionType.UPDATE,
        payload: {
          info,
          pairs: pairs
            .filter((pair) => pair.asset !== pair.collateral)
            .map((pair, i: number) => {
              pair.elapsedSeconds = BigNumber.from(Date.now()).div('1000').sub(pair.accrueInfo.lastAccrued)

              // Interest per year at last accrue, this will apply during the next accrue
              pair.interestPerYear = pair.accrueInfo.interestPerSecond.mul('60').mul('60').mul('24').mul('365')

              // The total collateral in the market (stable, doesn't accrue)
              pair.totalCollateralAmount = easyAmount(
                toAmount(pair.collateral, pair.totalCollateralShare),
                pair.collateral
              )

              // The total assets unborrowed in the market (stable, doesn't accrue)
              pair.totalAssetAmount = easyAmount(toAmount(pair.asset, pair.totalAsset.elastic), pair.asset)

              // The total assets borrowed in the market right now
              pair.currentBorrowAmount = easyAmount(accrue(pair, pair.totalBorrow.elastic, true), pair.asset)

              // The total amount of assets, both borrowed and still available right now
              pair.currentAllAssets = easyAmount(
                pair.totalAssetAmount.value.add(pair.currentBorrowAmount.value),
                pair.asset
              )

              pair.marketHealth = pair.totalCollateralAmount.value
                .mulDiv(e10(18), maximum(pair.currentExchangeRate, pair.oracleExchangeRate, pair.spotExchangeRate))
                .mulDiv(e10(18), pair.currentBorrowAmount.value)

              pair.currentTotalAsset = accrueTotalAssetWithFee(pair)

              pair.currentAllAssetShares = toShare(pair.asset, pair.currentAllAssets.value)

              // Maximum amount of assets available for withdrawal or borrow
              pair.maxAssetAvailable = minimum(
                pair.totalAsset.elastic.mulDiv(pair.currentAllAssets.value, pair.currentAllAssetShares),
                toAmount(pair.asset, toElastic(pair.currentTotalAsset, pair.totalAsset.base.sub(1000), false))
              )

              pair.maxAssetAvailableFraction = pair.maxAssetAvailable.mulDiv(
                pair.currentTotalAsset.base,
                pair.currentAllAssets.value
              )

              // The percentage of assets that is borrowed out right now
              pair.utilization = e10(18).mulDiv(pair.currentBorrowAmount.value, pair.currentAllAssets.value)

              // Interest per year received by lenders as of now
              pair.supplyAPR = takeFee(pair.interestPerYear.mulDiv(pair.utilization, e10(18)))

              // Interest payable by borrowers per year as of now
              pair.currentInterestPerYear = interestAccrue(pair, pair.interestPerYear)

              // Interest per year received by lenders as of now
              pair.currentSupplyAPR = takeFee(pair.currentInterestPerYear.mulDiv(pair.utilization, e10(18)))

              // The user's amount of collateral (stable, doesn't accrue)
              pair.userCollateralAmount = easyAmount(
                toAmount(pair.collateral, pair.userCollateralShare),
                pair.collateral
              )

              // The user's amount of assets (stable, doesn't accrue)
              pair.currentUserAssetAmount = easyAmount(
                pair.userAssetFraction.mulDiv(pair.currentAllAssets.value, pair.totalAsset.base),
                pair.asset
              )

              // The user's amount borrowed right now
              pair.currentUserBorrowAmount = easyAmount(
                pair.userBorrowPart.mulDiv(pair.currentBorrowAmount.value, pair.totalBorrow.base),
                pair.asset
              )

              // The user's amount of assets that are currently lent
              pair.currentUserLentAmount = easyAmount(
                pair.userAssetFraction.mulDiv(pair.currentBorrowAmount.value, pair.totalAsset.base),
                pair.asset
              )

              // Value of protocol fees
              pair.feesEarned = easyAmount(
                pair.accrueInfo.feesEarnedFraction.mulDiv(pair.currentAllAssets.value, pair.totalAsset.base),
                pair.asset
              )

              // The user's maximum borrowable amount based on the collateral provided, using all three oracle values
              pair.maxBorrowable = {
                oracle: pair.userCollateralAmount.value.mulDiv(e10(16).mul('75'), pair.oracleExchangeRate),
                spot: pair.userCollateralAmount.value.mulDiv(e10(16).mul('75'), pair.spotExchangeRate),
                stored: pair.userCollateralAmount.value.mulDiv(e10(16).mul('75'), pair.currentExchangeRate),
              }

              pair.maxBorrowable.minimum = minimum(
                pair.maxBorrowable.oracle,
                pair.maxBorrowable.spot,
                pair.maxBorrowable.stored
              )

              pair.maxBorrowable.safe = pair.maxBorrowable.minimum
                .mulDiv('95', '100')
                .sub(pair.currentUserBorrowAmount.value)

              pair.maxBorrowable.possible = minimum(pair.maxBorrowable.safe, pair.maxAssetAvailable)

              pair.safeMaxRemovable = ZERO

              pair.health = pair.currentUserBorrowAmount.value.mulDiv(e10(18), pair.maxBorrowable.minimum)

              pair.netWorth = getUSDValue(
                pair.currentUserAssetAmount.value.sub(pair.currentUserBorrowAmount.value),
                pair.asset
              ).add(getUSDValue(pair.userCollateralAmount.value, pair.collateral))

              pair.search = pair.asset.tokenInfo.symbol + '/' + pair.collateral.tokenInfo.symbol

              pair.oracle = getOracle(pair, chainId, tokens)

              pair.interestPerYear = {
                value: pair.interestPerYear,
                string: pair.interestPerYear.toFixed(16),
              }

              pair.supplyAPR = {
                value: pair.supplyAPR,
                string: Fraction.from(pair.supplyAPR, e10(16)).toString(),
              }
              pair.currentSupplyAPR = {
                value: pair.currentSupplyAPR,
                string: Fraction.from(pair.currentSupplyAPR, e10(16)).toString(),
              }
              pair.currentInterestPerYear = {
                value: pair.currentInterestPerYear,
                string: Fraction.from(pair.currentInterestPerYear, BigNumber.from(10).pow(16)).toString(),
              }
              pair.utilization = {
                value: pair.utilization,
                string: Fraction.from(pair.utilization, BigNumber.from(10).pow(16)).toString(),
              }
              pair.health = {
                value: pair.health,
                string: Fraction.from(pair.health, e10(16)),
              }
              pair.maxBorrowable = {
                oracle: easyAmount(pair.maxBorrowable.oracle, pair.asset),
                spot: easyAmount(pair.maxBorrowable.spot, pair.asset),
                stored: easyAmount(pair.maxBorrowable.stored, pair.asset),
                minimum: easyAmount(pair.maxBorrowable.minimum, pair.asset),
                safe: easyAmount(pair.maxBorrowable.safe, pair.asset),
                possible: easyAmount(pair.maxBorrowable.possible, pair.asset),
              }

              pair.safeMaxRemovable = easyAmount(pair.safeMaxRemovable, pair.collateral)

              return pair
            }),
        },
      })
    }
  }, [account, chainId, boringHelperContract, bentoBoxContract, currency.address, tokens, weth.address])

  const previousBlockNumber = usePrevious(blockNumber)

  useEffect(() => {
    blockNumber !== previousBlockNumber && updatePairs()
  }, [blockNumber, previousBlockNumber, updatePairs])

  return (
    <KashiContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </KashiContext.Provider>
  )
}

export function useKashiInfo() {
  const context = useContext(KashiContext)
  if (context === undefined) {
    throw new Error('useKashiInfo must be used within a KashiProvider')
  }
  return context.state.info
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
  return context.state.pairs.find((pair) => {
    return getAddress(pair.address) === getAddress(address)
  })
}

export default KashiProvider
