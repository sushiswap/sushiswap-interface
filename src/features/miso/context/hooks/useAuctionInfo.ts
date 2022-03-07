import { Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { CHAIN_KEY } from '@sushiswap/core-sdk'
import MISO from '@sushiswap/miso/exports/all.json'
import BASE_AUCTION_ABI from 'app/constants/abis/base-auction.json'
import { AuctionTemplate, RawLauncherInfo } from 'app/features/miso/context/types'
import { useContract, useMisoHelperContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useSingleContractMultipleMethods } from 'app/state/multicall/hooks'
import { useMemo } from 'react'

const AUCTION_INTERFACE = new Interface(BASE_AUCTION_ABI)

// @ts-ignore TYPE NEEDS FIXING
const arrayToMap = (result) =>
  // @ts-ignore TYPE NEEDS FIXING
  result?.reduce((acc, cur) => {
    acc[cur.name] = cur.data
    return acc
  }, {})

export const useAuctionHelperInfo = (auctionAddress?: string, marketTemplateId?: BigNumber, owner?: string) => {
  const { account } = useActiveWeb3React()
  const contract = useMisoHelperContract()
  const callsData = useMemo(
    () =>
      auctionAddress && marketTemplateId?.toNumber()
        ? [
            {
              methodName: 'getDocuments',
              callInputs: [auctionAddress],
            },
            {
              methodName: 'getUserMarketInfo',
              callInputs: [auctionAddress, owner],
            },
            {
              methodName:
                marketTemplateId?.toNumber() === AuctionTemplate.BATCH_AUCTION
                  ? 'getBatchAuctionInfo'
                  : marketTemplateId?.toNumber() === AuctionTemplate.DUTCH_AUCTION
                  ? 'getDutchAuctionInfo'
                  : 'getCrowdsaleInfo',
              callInputs: [auctionAddress],
            },
          ]
        : [],
    [account, auctionAddress, marketTemplateId, owner]
  )

  const results = useSingleContractMultipleMethods(contract, callsData)

  if (auctionAddress && marketTemplateId && results && Array.isArray(results) && results.length === callsData.length) {
    const [{ result: documents }, { result: marketInfo }, { result: auctionInfo }] = results
    return {
      auctionDocuments: arrayToMap(documents?.[0]),
      marketInfo: marketInfo?.[0],
      auctionInfo: auctionInfo?.[0],
      loading: results.some((el) => el.loading),
      error: results.some((el) => el.error),
    }
  }

  return {
    auctionDocuments: undefined,
    marketInfo: undefined,
    auctionInfo: undefined,
    loading: results.some((el) => el.loading),
    error: results.some((el) => el.error),
  }
}

export const useAuctionDetails = (auctionAddress?: string) => {
  const contract = useContract(auctionAddress, AUCTION_INTERFACE)
  const callsData = useMemo(
    () =>
      auctionAddress
        ? [
            {
              methodName: 'marketTemplate',
              callInputs: [],
            },
            {
              methodName: 'pointList',
              callInputs: [],
            },
            {
              methodName: 'wallet',
              callInputs: [],
            },
          ]
        : [],
    [auctionAddress]
  )

  const results = useSingleContractMultipleMethods(contract, callsData)
  if (auctionAddress && results && Array.isArray(results) && results.length === callsData.length) {
    const [{ result: marketTemplate }, { result: pointList }, { result: auctionLauncherAddress }] = results
    return {
      marketTemplateId: marketTemplate?.[0],
      pointListAddress: pointList?.[0],
      auctionLauncherAddress: auctionLauncherAddress?.[0],
      loading: results.some((el) => el.loading),
      error: results.some((el) => el.error),
    }
  }

  return {
    marketTemplateId: undefined,
    pointListAddress: undefined,
    auctionLauncherAddress: undefined,
    loading: results.some((el) => el.loading),
    error: results.some((el) => el.error),
  }
}

export const useAuctionLauncherDetails = (
  launcherAddress?: string
): { launcherInfo?: RawLauncherInfo; lpTokenAddress?: string } => {
  const { chainId } = useActiveWeb3React()
  const launcher = useContract(
    launcherAddress,
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.PostAuctionLauncher.abi : undefined
  )
  const callsData = useMemo(
    () =>
      launcherAddress
        ? [
            { methodName: 'launcherInfo', callInputs: [] },
            { methodName: 'getLPTokenAddress', callInputs: [] },
          ]
        : [],
    [launcherAddress]
  )

  const results = useSingleContractMultipleMethods(launcher, callsData)
  if (launcherAddress && results && Array.isArray(results) && results.length === callsData.length) {
    const [{ result: launcherInfo }, { result: lpTokenAddress }] = results
    return {
      launcherInfo: launcherInfo as any,
      lpTokenAddress: lpTokenAddress?.[0],
    }
  }

  return {
    launcherInfo: undefined,
    lpTokenAddress: undefined,
  }
}
