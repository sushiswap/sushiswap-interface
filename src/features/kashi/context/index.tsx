import { defaultAbiCoder } from '@ethersproject/abi'
import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, KASHI_ADDRESS, NATIVE, USD_ADDRESS, WNATIVE_ADDRESS } from '@sushiswap/core-sdk'
import { Fraction } from 'app/entities/bignumber'
import { Feature } from 'app/enums'
import { toAmount, toShare } from 'app/functions/bentobox'
import { featureEnabled } from 'app/functions/feature'
import { accrue, accrueTotalAssetWithFee, easyAmount, getUSDValue, interestAccrue, takeFee } from 'app/functions/kashi'
import { e10, maximum, minimum, ZERO } from 'app/functions/math'
import { getOracle } from 'app/functions/oracle'
import { toElastic } from 'app/functions/rebase'
import { useAllTokens } from 'app/hooks/Tokens'
import { useBentoBoxContract, useBoringHelperContract } from 'app/hooks/useContract'
import usePrevious from 'app/hooks/usePrevious'
import { useBentoStrategies, useClones } from 'app/services/graph/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useQueryFilter } from 'app/services/web3'
import { useBlockNumber } from 'app/state/application/hooks'
import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react'

// TODO: Refactor
// 1. use these functions instead
// 2. drop context and related shite

// import { toAmount, toShare } from '@sushiswap/bentobox-sdk'
// import { takeFee, interestAccrue, accrueTotalAssetWithFee, accrue } from '@sushiswap/kashi-sdk'

// should this be in core-sdk? rebase was introduced by bentobox...
// import { toElastic } from '@sushiswap/core-sdk'

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

const BLACKLISTED_ORACLES = ['0x8f2CC3376078568a04eBC600ae5F0a036DBfd812']

export function KashiProvider({ children }) {
  const [state, dispatch] = useReducer<React.Reducer<State, Reducer>>(reducer, initialState)

  const blockNumber = useBlockNumber()

  const { account, chainId } = useActiveWeb3React()

  const wnative = WNATIVE_ADDRESS[chainId]

  const currency = USD_ADDRESS[chainId]

  const boringHelperContract = useBoringHelperContract()

  const bentoBoxContract = useBentoBoxContract()

  const useEvents = chainId && chainId !== ChainId.BSC && chainId !== ChainId.MATIC

  const events = useQueryFilter({
    chainId,
    contract: bentoBoxContract,
    event: bentoBoxContract.filters.LogDeploy(KASHI_ADDRESS[chainId]),
    shouldFetch: useEvents,
  })

  const clones = useClones({ chainId, shouldFetch: !useEvents })

  const allTokens = useAllTokens()

  // TODO: Most of below isn't actually used... mostly just for addresses... figure out best path forward (multiple method multicall and drop boring helper)

  // Get the deployed pairs from events of subgraph and decode
  const deployedPairs = (
    useEvents ? events?.map((event) => ({ address: event.args.cloneAddress, data: event.args.data })) : clones
  )
    ?.map((clone) => {
      const deployParams = defaultAbiCoder.decode(['address', 'address', 'address', 'bytes'], clone.data)
      const pair = {
        address: clone.address,
        masterContract: KASHI_ADDRESS[chainId],
        collateral: allTokens[deployParams[0]],
        asset: allTokens[deployParams[1]],
        oracle: deployParams[2],
        oracleData: deployParams[3],
      }
      return {
        ...pair,
        oracle: getOracle(pair, chainId, allTokens),
      }
    })
    ?.filter((pair) => {
      if (pair.oracle && !pair.oracle.valid) {
        console.warn(`Invalid Oracle: ${pair.oracle.error}`, { pair })
      }
      return pair.oracle && !BLACKLISTED_ORACLES.includes(pair.oracle) && pair.oracle.valid
    })

  // Set for pair tokens
  const pairTokenSet: Set<string> = deployedPairs?.reduce(
    (previousValue, currentValue) => previousValue.add(currentValue.collateral.address).add(currentValue.asset.address),
    new Set([currency])
  )

  const strategies = useBentoStrategies({ chainId, shouldFetch: featureEnabled(Feature.BENTOBOX, chainId) })

  const updatePairs = useCallback(async () => {
    console.log('update pairs', boringHelperContract && bentoBoxContract && deployedPairs && deployedPairs.length > 0)
    if (!account || !chainId || !featureEnabled(Feature.KASHI, chainId)) {
      return
    }

    if (boringHelperContract && bentoBoxContract && deployedPairs && deployedPairs.length > 0) {
      const info = await boringHelperContract.getUIInfo(account, [], currency, [KASHI_ADDRESS[chainId]])

      const balances = (await boringHelperContract.getBalances(account, Array.from(pairTokenSet)))?.reduce(
        (previousValue, currentValue) => {
          return { ...previousValue, [currentValue[0]]: currentValue }
        },
        {}
      )

      const tokens = Object.values(allTokens)
        .filter((token) => pairTokenSet.has(token.address))
        .reduce((previousValue, currentValue) => {
          const balance = balances[currentValue.address]
          const strategy = strategies?.find((strategy) => strategy.token === currentValue.address.toLowerCase())
          const usd = e10(currentValue.decimals).mulDiv(balances[currency].rate, balance.rate)
          const symbol = currentValue.address === wnative ? NATIVE[chainId].symbol : currentValue.symbol
          return {
            ...previousValue,
            [currentValue.address]: {
              ...currentValue,
              ...balance,
              strategy,
              usd,
              symbol,
            },
          }
        }, {})

      // Get full info on all the verified pairs
      const pairs = (
        await boringHelperContract.pollKashiPairs(
          account,
          deployedPairs.map((pair) => pair.address)
        )
      ).map((pair, i) => ({
        ...pair,
        address: deployedPairs[i].address,
        oracle: deployedPairs[i].oracle,
        asset: tokens[pair.asset],
        collateral: tokens[pair.collateral],
      }))

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

              pair.search = pair.asset.symbol + '/' + pair.collateral.symbol

              pair.interestPerYear = {
                value: pair.interestPerYear,
                string: pair.interestPerYear.toFixed(16),
              }

              pair.strategyAPY = {
                asset: {
                  value: BigNumber.from(String(Math.floor((pair.asset.strategy?.apy ?? 0) * 1e16))),
                  string: String(pair.asset.strategy?.apy ?? 0),
                },
                collateral: {
                  value: BigNumber.from(String(Math.floor((pair.collateral.strategy?.apy ?? 0) * 1e16))),
                  string: String(pair.collateral.strategy?.apy ?? 0),
                },
              }
              pair.supplyAPR = {
                value: pair.supplyAPR,
                valueWithStrategy: pair.supplyAPR.add(pair.strategyAPY.asset.value),
                string: Fraction.from(pair.supplyAPR, e10(16)).toString(),
                stringWithStrategy: Fraction.from(pair.strategyAPY.asset.value.add(pair.supplyAPR), e10(16)).toString(),
              }
              pair.currentSupplyAPR = {
                value: pair.currentSupplyAPR,
                valueWithStrategy: pair.currentSupplyAPR.add(pair.strategyAPY.asset.value),
                string: Fraction.from(pair.currentSupplyAPR, e10(16)).toString(),
                stringWithStrategy: Fraction.from(
                  pair.currentSupplyAPR.add(pair.strategyAPY.asset.value),
                  e10(16)
                ).toString(),
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
  }, [
    boringHelperContract,
    bentoBoxContract,
    deployedPairs,
    account,
    chainId,
    currency,
    pairTokenSet,
    allTokens,
    strategies,
    wnative,
  ])

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
