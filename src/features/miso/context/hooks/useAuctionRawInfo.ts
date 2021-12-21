import { BigNumber } from '@ethersproject/bignumber'
import { AuctionTemplate, RawAuctionInfo } from 'app/features/miso/context/types'
import { useMisoHelperContract } from 'app/hooks'
import { useSingleContractMultipleMethods } from 'app/state/multicall/hooks'
import { useMemo } from 'react'

export const useAuctionRawInfos = (
  auctions: string[],
  templateIds?: (BigNumber | undefined)[]
): (RawAuctionInfo | undefined)[] => {
  const contract = useMisoHelperContract(false)
  const auctionInfoInput = useMemo(
    () =>
      auctions.map((el, index) => {
        if (!templateIds?.[index]) return undefined
        if (templateIds[index]!!.toNumber() === AuctionTemplate.BATCH_AUCTION) {
          return {
            methodName: 'getBatchAuctionInfo',
            callInputs: [el],
          }
        } else if (templateIds[index]!!.toNumber() === AuctionTemplate.DUTCH_AUCTION) {
          return {
            methodName: 'getDutchAuctionInfo',
            callInputs: [el],
          }
        } else {
          return {
            methodName: 'getCrowdsaleInfo',
            callInputs: [el],
          }
        }
      }),
    [auctions, templateIds]
  )

  const results = useSingleContractMultipleMethods(contract, auctionInfoInput)
  if (results && Array.isArray(results) && results.length === auctions.length) {
    return results.map<RawAuctionInfo | undefined>((el) => {
      if (el.result && Array.isArray(el.result) && el.result.length > 0) {
        return el.result[0]
      }

      return undefined
    })
  }

  return Array(auctions.length).fill(undefined)
}

export default useAuctionRawInfos
