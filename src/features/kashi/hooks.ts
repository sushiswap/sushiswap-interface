import { defaultAbiCoder } from '@ethersproject/abi'
import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero, Zero } from '@ethersproject/constants'
import { ChainId, JSBI, KASHI_ADDRESS, NATIVE, Token, USD, WNATIVE_ADDRESS, ZERO } from '@sushiswap/core-sdk'
import { CHAINLINK_PRICE_FEED_MAP, ChainlinkPriceFeedEntry } from 'app/config/oracles/chainlink'
import { Fraction } from 'app/entities'
import { Feature } from 'app/enums'
import { KashiMarket } from 'app/features/kashi/types'
import {
  accrue,
  accrueTotalAssetWithFee,
  e10,
  easyAmount,
  featureEnabled,
  getOracle,
  getUSDValue,
  interestAccrue,
  maximum,
  minimum,
  takeFee,
  toAmount,
  toElastic,
  toShare,
  validateChainlinkOracleData,
} from 'app/functions'
import { useBentoBoxContract, useBoringHelperContract } from 'app/hooks'
import { useTokens } from 'app/hooks/Tokens'
import useBentoRebases from 'app/hooks/useBentoRebases'
import { useUSDCPricesSubgraph } from 'app/hooks/useUSDCSubgraph'
import { useSingleCallResult } from 'app/lib/hooks/multicall'
import { useBentoStrategies, useClones } from 'app/services/graph'
import { useActiveWeb3React, useQueryFilter } from 'app/services/web3'
import { useMemo } from 'react'

import KashiMediumRiskLendingPair from './KashiMediumRiskLendingPair'

const BLACKLISTED_TOKENS = ['0xC6d54D2f624bc83815b49d9c2203b1330B841cA0']

const BLACKLISTED_ORACLES = [
  '0x8f2CC3376078568a04eBC600ae5F0a036DBfd812',
  '0x8f7C7181Ed1a2BA41cfC3f5d064eF91b67daef66',
  '0x6b7D436583e5fE0874B7310b74D29A13af816860',
]

const BLACKLISTED_PAIRS = ['0xF71e398B5CBb473a3378Bf4335256295A8eD713d']

export const useKashiMediumRiskLendingPositions = (account: string): KashiMediumRiskLendingPair[] => {
  const addresses = useKashiPairAddresses()
  const markets = useKashiMediumRiskLendingPairs(account, addresses)
  return markets.filter((pair: KashiMediumRiskLendingPair) => JSBI.greaterThan(pair.userAssetFraction, ZERO))
}

export const useKashiMediumRiskBorrowingPositions = (account: string): KashiMediumRiskLendingPair[] => {
  const addresses = useKashiPairAddresses()
  const markets = useKashiMediumRiskLendingPairs(account, addresses)
  return markets.filter(
    (pair: KashiMediumRiskLendingPair) =>
      JSBI.greaterThan(pair.userCollateralShare, ZERO) || JSBI.greaterThan(pair.userBorrowPart, ZERO)
  )
}

// Reduce all tokens down to only those which are found in the Oracle mapping
export function useKashiTokens(): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()
  const allTokens = useTokens()
  return useMemo(
    () =>
      Object.values(allTokens).reduce((previousValue: Record<string, Token>, currentValue: Token) => {
        if (
          chainId &&
          CHAINLINK_PRICE_FEED_MAP?.[chainId] &&
          Object.values(CHAINLINK_PRICE_FEED_MAP?.[chainId])?.some((value: ChainlinkPriceFeedEntry) => {
            return currentValue.address === value.from || currentValue.address === value.to
          })
        ) {
          previousValue[currentValue.address] = currentValue
        }
        return previousValue
      }, {}),
    [allTokens, chainId]
  )
}

export function useKashiPairAddresses(): string[] {
  const bentoBoxContract = useBentoBoxContract()
  const { chainId } = useActiveWeb3React()
  const useEvents = useMemo(
    () =>
      Boolean(
        chainId &&
          chainId !== ChainId.BSC &&
          chainId !== ChainId.MATIC &&
          chainId !== ChainId.ARBITRUM &&
          chainId !== ChainId.AVALANCHE
      ),
    [chainId]
  )
  const tokens = useKashiTokens()
  const { data: events } = useQueryFilter({
    chainId,
    contract: bentoBoxContract,
    event: chainId && bentoBoxContract && bentoBoxContract.filters.LogDeploy(KASHI_ADDRESS[chainId]),
    shouldFetch: Boolean(chainId && useEvents && featureEnabled(Feature.KASHI, chainId)),
  })
  const clones = useClones({ chainId, shouldFetch: !useEvents })
  return useMemo(
    () =>
      (useEvents
        ? events?.map((event) => ({
            address:
              // @ts-ignore TYPE NEEDS FIXING
              event.args.cloneAddress,
            // @ts-ignore TYPE NEEDS FIXING
            data: event.args.data,
          }))
        : clones
      )
        // @ts-ignore TYPE NEEDS FIXING
        ?.reduce((previousValue, currentValue) => {
          try {
            const [collateral, asset, oracle, oracleData] = defaultAbiCoder.decode(
              ['address', 'address', 'address', 'bytes'],
              currentValue.data
            )
            if (
              BLACKLISTED_TOKENS.includes(collateral) ||
              BLACKLISTED_TOKENS.includes(asset) ||
              BLACKLISTED_ORACLES.includes(oracle) ||
              !validateChainlinkOracleData(chainId, tokens[collateral], tokens[asset], oracleData)
            ) {
              return previousValue
            }
            return [...previousValue, currentValue.address]
          } catch (error) {
            return previousValue
          }
        }, []),
    [chainId, clones, events, tokens, useEvents]
  )
}

type BoringHelperKashiPair = {
  collateral: string
  asset: string
  oracle: string
  oracleData: string
  totalCollateralShare: string
  userCollateralShare: string
  totalAsset: {
    elastic: BigNumber
    base: BigNumber
  }
  userAssetFraction: string
  totalBorrow: {
    elastic: BigNumber
    base: BigNumber
  }
  userBorrowPart: BigNumber
  currentExchangeRate: BigNumber
  spotExchangeRate: BigNumber
  oracleExchangeRate: BigNumber
  accrueInfo: {
    interestPerSecond: BigNumber
    lastAccrued: BigNumber
    feesEarnedFraction: BigNumber
  }
}

export function useKashiMediumRiskLendingPairs(
  account: string | null | undefined,
  addresses: string[] = []
): KashiMediumRiskLendingPair[] {
  const { chainId } = useActiveWeb3React()
  const boringHelperContract = useBoringHelperContract()
  const tokens = useKashiTokens()
  const args = useMemo(() => [account ? account : AddressZero, addresses], [account, addresses])
  const { result, valid, loading, syncing, error } = useSingleCallResult(boringHelperContract, 'pollKashiPairs', args, {
    gasRequired: 20_000_000,
  })

  const { rebases } = useBentoRebases(useMemo(() => Object.values(tokens), [tokens]))
  const prices = useUSDCPricesSubgraph(Object.values(tokens))
  // TODO: for skeleton loading
  // const kashiRepositoryContract = useKashiRepositoryContract()
  // const callStates = useSingleContractMultipleData(kashiRepositoryContract, 'getPair', args, NEVER_RELOAD)

  return useMemo(() => {
    if (!chainId || !result || !rebases || !prices) {
      return []
    }
    return result?.[0]
      .filter(
        (pair: BoringHelperKashiPair) =>
          rebases[pair.collateral] &&
          rebases[pair.collateral]?.token &&
          rebases[pair.asset] &&
          rebases[pair.asset]?.token
      )
      .map(
        (pair: BoringHelperKashiPair) =>
          new KashiMediumRiskLendingPair({
            accrueInfo: {
              feesEarnedFraction: JSBI.BigInt(pair.accrueInfo.feesEarnedFraction.toString()),
              lastAccrued: JSBI.BigInt(pair.accrueInfo.lastAccrued),
              interestPerSecond: JSBI.BigInt(pair.accrueInfo.interestPerSecond.toString()),
            },
            // @ts-ignore
            collateral: rebases[pair.collateral],
            // @ts-ignore
            asset: rebases[pair.asset],
            collateralPrice: prices[pair.collateral],
            assetPrice: prices[pair.asset],
            oracle: getOracle(chainId, pair.oracle, pair.oracleData),
            totalCollateralShare: JSBI.BigInt(pair.totalCollateralShare.toString()),
            totalAsset: {
              elastic: JSBI.BigInt(pair.totalAsset.elastic.toString()),
              base: JSBI.BigInt(pair.totalAsset.base.toString()),
            },
            totalBorrow: {
              elastic: JSBI.BigInt(pair.totalBorrow.elastic.toString()),
              base: JSBI.BigInt(pair.totalBorrow.base.toString()),
            },
            exchangeRate: JSBI.BigInt(pair.currentExchangeRate.toString()),
            oracleExchangeRate: JSBI.BigInt(pair.oracleExchangeRate.toString()),
            spotExchangeRate: JSBI.BigInt(pair.spotExchangeRate.toString()),
            userCollateralShare: JSBI.BigInt(pair.userCollateralShare.toString()),
            userAssetFraction: JSBI.BigInt(pair.userAssetFraction.toString()),
            userBorrowPart: JSBI.BigInt(pair.userBorrowPart.toString()),
          })
      )
  }, [chainId, prices, rebases, result])
}

// export function useKashiMediumRiskLendingPairs(
//   account: string | null | undefined,
//   addresses: string[] = []
// ): KashiMediumRiskLendingPair[] {
//   const { chainId } = useActiveWeb3React()
//   const boringHelperContract = useBoringHelperContract()
//   const tokens = useKashiTokens()
//   const args = useMemo(() => [account ? account : AddressZero, addresses], [account, addresses])
//   const { result } = useSingleCallResult(boringHelperContract, 'pollKashiPairs', args, { blocksPerFetch: 10 })
//   const { rebases } = useBentoRebases(Object.values(tokens))

//   // TODO: for skeleton loading
//   // const kashiRepositoryContract = useKashiRepositoryContract()
//   // const callStates = useSingleContractMultipleData(kashiRepositoryContract, 'getPair', args, NEVER_RELOAD)

//   return useMemo(() => {
//     if (!chainId || !result || !rebases) {
//       return []
//     }

//     return result?.[0].map((pair: any) => {
//       if (!rebases[pair.collateral]?.token || !rebases[pair.asset]?.token) return undefined

//       return new KashiMediumRiskLendingPair({
//         accrueInfo: {
//           feesEarnedFraction: JSBI.BigInt(pair.accrueInfo.feesEarnedFraction.toString()),
//           lastAccrued: JSBI.BigInt(pair.accrueInfo.lastAccrued),
//           interestPerSecond: JSBI.BigInt(pair.accrueInfo.interestPerSecond.toString()),
//         },
//         // @ts-ignore
//         collateral: rebases[pair.collateral],
//         // @ts-ignore
//         asset: rebases[pair.asset],
//         oracle: getOracle(chainId, pair.oracle, pair.oracleData),
//         totalCollateralShare: JSBI.BigInt(pair.totalCollateralShare.toString()),
//         totalAsset: {
//           elastic: JSBI.BigInt(pair.totalAsset.elastic.toString()),
//           base: JSBI.BigInt(pair.totalAsset.base.toString()),
//         },
//         totalBorrow: {
//           elastic: JSBI.BigInt(pair.totalBorrow.elastic.toString()),
//           base: JSBI.BigInt(pair.totalBorrow.base.toString()),
//         },
//         exchangeRate: JSBI.BigInt(pair.currentExchangeRate.toString()),
//         oracleExchangeRate: JSBI.BigInt(pair.oracleExchangeRate.toString()),
//         spotExchangeRate: JSBI.BigInt(pair.spotExchangeRate.toString()),
//         userCollateralShare: JSBI.BigInt(pair.userCollateralShare.toString()),
//         userAssetFraction: JSBI.BigInt(pair.userAssetFraction.toString()),
//         userBorrowPart: JSBI.BigInt(pair.userBorrowPart.toString()),
//       })
//     })
//   }, [chainId, result, rebases])
// }

export function useKashiMediumRiskLendingPair(
  account: string | null | undefined,
  address: string
): KashiMediumRiskLendingPair {
  return useKashiMediumRiskLendingPairs(account, [getAddress(address)])[0]
}

export const useKashiPairs = (addresses: string[] = []) => {
  const { account } = useActiveWeb3React()
  return useKashiPairsForAccount(account, addresses)
}

export function useKashiPairsForAccount(account: string | null | undefined, addresses: string[] = []) {
  const { chainId } = useActiveWeb3React()

  const boringHelperContract = useBoringHelperContract()

  // @ts-ignore TYPE NEEDS FIXING
  const wnative = WNATIVE_ADDRESS[chainId]

  // @ts-ignore TYPE NEEDS FIXING
  const currency: Token = USD[chainId]

  const tokens = useKashiTokens()

  const pollArgs = useMemo(() => [account, addresses], [account, addresses])

  // TODO: Replace
  // @ts-ignore TYPE NEEDS FIXING
  const pollKashiPairs: any[] = useSingleCallResult(boringHelperContract, 'pollKashiPairs', pollArgs, {
    blocksPerFetch: 0,
  })?.result?.[0]

  const { rebases } = useBentoRebases(Object.values(tokens))

  const entities =
    chainId &&
    pollKashiPairs?.map(
      (pair: any) =>
        new KashiMediumRiskLendingPair({
          accrueInfo: {
            feesEarnedFraction: JSBI.BigInt(pair.accrueInfo.feesEarnedFraction.toString()),
            lastAccrued: JSBI.BigInt(pair.accrueInfo.lastAccrued),
            interestPerSecond: JSBI.BigInt(pair.accrueInfo.interestPerSecond.toString()),
          },
          // @ts-ignore
          collateral: rebases[pair.collateral],
          // @ts-ignore
          asset: rebases[pair.asset],
          oracle: getOracle(chainId, pair.oracle, pair.oracleData),
          totalCollateralShare: JSBI.BigInt(pair.totalCollateralShare.toString()),
          totalAsset: {
            elastic: JSBI.BigInt(pair.totalAsset.elastic.toString()),
            base: JSBI.BigInt(pair.totalAsset.base.toString()),
          },
          totalBorrow: {
            elastic: JSBI.BigInt(pair.totalBorrow.elastic.toString()),
            base: JSBI.BigInt(pair.totalBorrow.base.toString()),
          },
          exchangeRate: JSBI.BigInt(pair.currentExchangeRate.toString()),
          oracleExchangeRate: JSBI.BigInt(pair.oracleExchangeRate.toString()),
          spotExchangeRate: JSBI.BigInt(pair.spotExchangeRate.toString()),
          userCollateralShare: JSBI.BigInt(pair.userCollateralShare.toString()),
          userAssetFraction: JSBI.BigInt(pair.userAssetFraction.toString()),
          userBorrowPart: JSBI.BigInt(pair.userBorrowPart.toString()),
        })
    )

  const strategies = useBentoStrategies({ chainId })

  const tokenAddresses = Object.keys(tokens)

  const getBalancesArgs = useMemo(() => [account, tokenAddresses], [account, tokenAddresses])

  // TODO: Replace
  // @ts-ignore TYPE NEEDS FIXING
  const balancesCallState = useSingleCallResult(boringHelperContract, 'getBalances', getBalancesArgs)

  const balances = balancesCallState?.result?.[0]?.reduce(
    // @ts-ignore TYPE NEEDS FIXING
    (previousValue, currentValue) => {
      return { ...previousValue, [currentValue[0]]: currentValue }
    },
    {}
  )

  // TODO: Disgusting but until final refactor this will have to remain...
  const pairTokens = Object.values(tokens)
    .filter((token) => balances?.[token.address])
    .reduce((previousValue, currentValue) => {
      const balance = balances[currentValue.address]
      const strategy = strategies?.find((strategy) => strategy.token === currentValue.address.toLowerCase())
      const usd = e10(currentValue.decimals).mulDiv(balances[currency.address].rate, balance.rate)
      // @ts-ignore TYPE NEEDS FIXING
      const symbol = currentValue.address === wnative ? NATIVE[chainId].symbol : currentValue.symbol
      return {
        ...previousValue,
        [currentValue.address]: {
          ...currentValue,
          ...balance,
          address: currentValue.address,
          elastic: balance.bentoAmount,
          base: balance.bentoShare,
          strategy,
          usd,
          symbol,
        },
      }
    }, {})

  const pairs = useMemo<any[]>(() => {
    if (!addresses || !tokenAddresses || !pollKashiPairs) {
      return []
    }
    return addresses.reduce((previousValue, currentValue, i) => {
      if (chainId && pairTokens && balances) {
        // Hack until we instantiate entity here...
        const pair = Object.assign({}, pollKashiPairs?.[i])

        pair.address = currentValue
        pair.oracle = getOracle(chainId, pair.oracle, pair.oracle.data)
        // @ts-ignore TYPE NEEDS FIXING
        pair.asset = pairTokens[pair.asset]
        // @ts-ignore TYPE NEEDS FIXING
        pair.collateral = pairTokens[pair.collateral]

        pair.elapsedSeconds = BigNumber.from(Date.now()).div('1000').sub(pair.accrueInfo.lastAccrued)

        // Interest per year at last accrue, this will apply during the next accrue
        pair.interestPerYear = pair.accrueInfo.interestPerSecond.mul('60').mul('60').mul('24').mul('365')

        // The total collateral in the market (stable, doesn't accrue)
        pair.totalCollateralAmount = easyAmount(toAmount(pair.collateral, pair.totalCollateralShare), pair.collateral)

        // The total assets unborrowed in the market (stable, doesn't accrue)
        pair.totalAssetAmount = easyAmount(toAmount(pair.asset, pair.totalAsset.elastic), pair.asset)

        // The total assets borrowed in the market right now
        pair.currentBorrowAmount = easyAmount(accrue(pair, pair.totalBorrow.elastic, true), pair.asset)

        // The total amount of assets, both borrowed and still available right now
        pair.currentAllAssets = easyAmount(pair.totalAssetAmount.value.add(pair.currentBorrowAmount.value), pair.asset)

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
        pair.userCollateralAmount = easyAmount(toAmount(pair.collateral, pair.userCollateralShare), pair.collateral)

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

        pair.maxBorrowable.safe = pair.maxBorrowable.minimum.mulDiv('95', '100').sub(pair.currentUserBorrowAmount.value)

        pair.maxBorrowable.possible = minimum(pair.maxBorrowable.safe, pair.maxAssetAvailable)

        pair.safeMaxRemovable = Zero

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
        pair.utilization = {
          value: pair.utilization,
          string: Fraction.from(pair.utilization, BigNumber.from(10).pow(16)).toString(),
        }
        pair.supplyAPR = {
          value: pair.supplyAPR,
          valueWithStrategy: pair.supplyAPR.add(pair.strategyAPY.asset.value.mulDiv(pair.utilization.value, e10(18))),
          string: Fraction.from(pair.supplyAPR, e10(16)).toString(),
          stringWithStrategy: Fraction.from(
            pair.strategyAPY.asset.value.add(
              pair.supplyAPR.add(pair.strategyAPY.asset.value.mulDiv(pair.utilization.value, e10(18)))
            ),
            e10(16)
          ).toString(),
        }
        pair.currentSupplyAPR = {
          value: pair.currentSupplyAPR,
          valueWithStrategy: pair.currentSupplyAPR.add(
            pair.strategyAPY.asset.value.mulDiv(pair.utilization.value, e10(18))
          ),
          string: Fraction.from(pair.currentSupplyAPR, e10(16)).toString(),
          stringWithStrategy: Fraction.from(
            pair.currentSupplyAPR.add(pair.strategyAPY.asset.value.mulDiv(pair.utilization.value, e10(18))),
            e10(16)
          ).toString(),
        }
        pair.currentInterestPerYear = {
          value: pair.currentInterestPerYear,
          string: Fraction.from(pair.currentInterestPerYear, BigNumber.from(10).pow(16)).toString(),
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

        // @ts-ignore TYPE NEEDS FIXING
        previousValue = [...previousValue, pair]
      }

      return previousValue
    }, [])
  }, [addresses, tokenAddresses, pollKashiPairs, chainId, pairTokens, balances])

  // console.log(entities?.[0], pairs?.[0])
  return pairs

  //   return useMemo(
  //     () =>
  //       addresses.reduce((memo, address, i) => {
  //         const value = pairs?.result[0]?.[i]
  //         if (value && chainId) memo = [...memo, value]
  //         return memo
  //       }, []),
  //     [addresses, chainId, pairs]
  //   )
}

export function useKashiPair(address: string): KashiMarket | undefined {
  // @ts-ignore TYPE NEEDS FIXING
  return useKashiPairs([getAddress(address)])[0]
}
