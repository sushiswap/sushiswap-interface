import { BigNumber } from '@ethersproject/bignumber'
import { AuctionTemplate } from 'app/features/miso/context/types'
import { useMisoHelperContract } from 'app/hooks'
import { useSingleContractMultipleMethods } from 'app/state/multicall/hooks'
import { useMemo } from 'react'

const useAuctionsInfo = (auctions: string[], templateIds: BigNumber[]) => {
  const contract = useMisoHelperContract(false)
  const auctionInfoInput = useMemo(
    () =>
      auctions.length === templateIds.length && templateIds.every((el) => !!el)
        ? auctions.map((el, index) => {
            if (templateIds[index].toNumber() === AuctionTemplate.BATCH_AUCTION) {
              return {
                methodName: 'getBatchAuctionInfo',
                callInputs: [el],
              }
            } else if (templateIds[index].toNumber() === AuctionTemplate.DUTCH_AUCTION) {
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
          })
        : [],
    [auctions, templateIds]
  )

  return useSingleContractMultipleMethods(contract, auctionInfoInput)
}

export default useAuctionsInfo
