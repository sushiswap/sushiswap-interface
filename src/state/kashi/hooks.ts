import { Contract } from '@ethersproject/contracts'
import { Token } from '@sushiswap/core-sdk'
import ORACLE_ABI from 'app/constants/abis/chainlink-oracle.json'
import { ERC20_ABI } from 'app/constants/abis/erc20'
import KASHIPAIR_ABI from 'app/constants/abis/kashipair.json'
import { useBentoBoxContract } from 'app/hooks'
import { useAllTokens } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import { useMultipleContractsMultipleMethods } from 'app/state/multicall/hooks'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'

interface KashiPair {
  address: string
  accrueInfo: {
    interestPerSecond: BigNumber
    lastAccrued: BigNumber
    feesEarnedFraction: BigNumber
  }
  asset: string
  balanceOf: BigNumber
  collateral: string
  exchangeRate: BigNumber
  oracle: string
  oracleData: string
  totalAsset: {
    elastic: BigNumber
    base: BigNumber
  }
  totalBorrow: {
    elastic: BigNumber
    base: BigNumber
  }
  totalCollateralShare: BigNumber
  userBorrowPart: BigNumber
  userCollateralShare: BigNumber
}

export const useKashiPairsRPC = ({
  shouldFetch = true,
  pairAddresses,
}: {
  shouldFetch?: boolean
  pairAddresses?: string[]
}) => {
  const { account } = useActiveWeb3React()
  const allTokens = useAllTokens()
  const bentoBoxContract = useBentoBoxContract()

  const kashiPairsContracts = useMemo(
    () => pairAddresses.map((pairAddress) => new Contract(pairAddress, KASHIPAIR_ABI)),
    [pairAddresses]
  )
  const kashiPairsCallData = useMemo(
    () =>
      shouldFetch
        ? pairAddresses.map(() => [
            {
              methodName: 'collateral',
            },
            {
              methodName: 'asset',
            },
            {
              methodName: 'oracle',
            },
            {
              methodName: 'oracleData',
            },
            {
              methodName: 'totalCollateralShare',
            },
            {
              methodName: 'userCollateralShare',
              callInputs: [account],
            },
            {
              methodName: 'totalAsset',
            },
            {
              methodName: 'balanceOf',
              callInputs: [account],
            },
            {
              methodName: 'totalBorrow',
            },
            {
              methodName: 'userBorrowPart',
              callInputs: [account],
            },
            {
              methodName: 'exchangeRate',
            },
            {
              methodName: 'accrueInfo',
            },
          ])
        : [],
    [account, pairAddresses, shouldFetch]
  )

  const kashiPairsCalls = useMultipleContractsMultipleMethods(kashiPairsContracts, kashiPairsCallData)
  const kashiPairs: KashiPair[] = useMemo(
    () =>
      kashiPairsCalls.map((pair, i) => ({
        address: pairAddresses[i],
        ...pair.reduce(
          (previousValue, currentValue, j) => ({
            ...previousValue,
            [kashiPairsCallData[i][j].methodName]:
              currentValue.result?.length === 1 ? currentValue.result?.[0] : currentValue.result,
          }),
          {}
        ),
      })) as any,
    [kashiPairsCallData, kashiPairsCalls, pairAddresses]
  )
  const kashiPairsLoading = useMemo(
    () => kashiPairsCalls.some((callStates) => callStates.some((callState) => callState.loading)),
    [kashiPairsCalls]
  )

  // Extract all the tokens from the pairs
  const tokens = useMemo<Token[]>(() => {
    if (!kashiPairs) {
      return []
    }
    return Array.from(
      kashiPairs?.reduce((previousValue, currentValue) => {
        const asset = allTokens[currentValue.asset]
        const collateral = allTokens[currentValue.collateral]
        return previousValue.add(asset).add(collateral)
      }, new Set([]))
    )
  }, [allTokens, kashiPairs])

  // Fethces oracle data, token balances, token totals from bento
  const miscContracts = useMemo(
    () =>
      !kashiPairsLoading
        ? [
            ...kashiPairs.map((pair) => new Contract(pair.oracle, ORACLE_ABI)),
            ...tokens.map((token) => new Contract(token.address, ERC20_ABI)),
            ...tokens.map(() => bentoBoxContract),
          ]
        : [],
    [bentoBoxContract, kashiPairs, kashiPairsLoading, tokens]
  )
  const miscCallData = useMemo(
    () =>
      !kashiPairsLoading
        ? [
            ...kashiPairs.map((pair) => [
              {
                methodName: 'peek',
                callInputs: [pair.oracleData],
              },
              {
                methodName: 'peekSpot',
                callInputs: [pair.oracleData],
              },
            ]),
            ...tokens.map(() => [
              {
                methodName: 'balanceOf',
                callInputs: [account],
              },
            ]),
            ...tokens.map((token) => [
              {
                methodName: 'balanceOf',
                callInputs: [token.address, account],
              },
              {
                methodName: 'totals',
                callInputs: [token.address],
              },
            ]),
          ]
        : [],
    [account, kashiPairs, kashiPairsLoading, tokens]
  )

  const miscCalls = useMultipleContractsMultipleMethods(miscContracts, miscCallData)
  const miscLoading = useMemo(
    () => miscCalls.some((callStates) => callStates.some((callState) => callState.loading)),
    [miscCalls]
  )
  const oracleData = useMemo(
    () =>
      !miscLoading
        ? miscCalls.slice(0, kashiPairs.length).map((call) => ({
            oracleExchangeRate: call[0].result[1],
            spotExchangeRate: call[1].result.rate,
          }))
        : undefined,
    [kashiPairs.length, miscCalls, miscLoading]
  )
  const tokenData = useMemo(
    () =>
      !miscLoading
        ? {
            walletBalances: miscCalls.slice(kashiPairs.length, kashiPairs.length + tokens.length).map((token, i) => ({
              address: tokens[i].address,
              balanceOf: (token[0].result?.balance as BigNumber) ?? BigNumber.from(0),
            })),
            bentoData: miscCalls
              .slice(kashiPairs.length + tokens.length, kashiPairs.length + tokens.length * 2)
              .map((token, i) => ({
                address: tokens[i].address,
                bentoBalance: token[0].result[0],
                base: token[1].result.base as BigNumber,
                elastic: token[1].result.elastic as BigNumber,
              })),
          }
        : undefined,
    [kashiPairs.length, miscCalls, miscLoading, tokens]
  )

  return useMemo(
    () =>
      !kashiPairsLoading && !!oracleData
        ? {
            pairs: kashiPairs.map((pair, i) => ({
              ...pair,
              oracleExchangeRate: oracleData[i].oracleExchangeRate,
              spotExchangeRate: oracleData[i].spotExchangeRate,
            })),
            tokens: tokens.map((token) => ({
              address: token.address,
              balance: tokenData.walletBalances.find((balance) => token.address === balance.address).balanceOf,
              ...tokenData.bentoData.find((data) => token.address === data.address),
              ...token,
            })),
          }
        : {},
    [kashiPairs, kashiPairsLoading, oracleData, tokens, tokenData]
  )
}
