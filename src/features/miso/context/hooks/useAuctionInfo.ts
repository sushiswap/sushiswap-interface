import { Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import BASE_AUCTION_ABI from 'app/constants/abis/base-auction.json'
import { AuctionTemplate } from 'app/features/miso/context/types'
import { useContract, useMisoHelperContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useSingleContractMultipleMethods } from 'app/state/multicall/hooks'
import { useMemo } from 'react'

const AUCTION_INTERFACE = new Interface(BASE_AUCTION_ABI)

const arrayToMap = (result) =>
  result?.reduce((acc, cur) => {
    acc[cur.name] = cur.data
    return acc
  }, {})

export const useAuctionHelperInfo = (auctionAddress?: string, marketTemplateId?: BigNumber, owner?: string) => {
  const { account } = useActiveWeb3React()
  const contract = useMisoHelperContract()
  const callsData = useMemo(
    () =>
      auctionAddress && marketTemplateId
        ? [
            {
              methodName: 'getDocuments',
              callInputs: [auctionAddress],
            },
            {
              methodName: 'getUserMarketInfo',
              callInputs: [auctionAddress, auctionAddress ? owner ?? account ?? undefined : undefined],
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
      loading: false,
    }
  }

  return {
    auctionDocuments: undefined,
    marketInfo: undefined,
    auctionInfo: undefined,
    loading: results.some((el) => el.loading),
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
          ]
        : [],
    [auctionAddress]
  )

  const results = useSingleContractMultipleMethods(contract, callsData)
  if (auctionAddress && results && Array.isArray(results) && results.length === callsData.length) {
    const [{ result: marketTemplate }, { result: pointList }] = results
    return {
      marketTemplateId: marketTemplate?.[0],
      whitelist: pointList?.[0],
      loading: false,
    }
  }

  return {
    marketTemplateId: undefined,
    whitelist: undefined,
    loading: results.some((el) => el.loading),
  }
}
