import { BAD_AUCTIONS } from 'app/features/miso/context/constants'
import { AuctionStatus, RawAuction } from 'app/features/miso/context/types'
import { useMisoHelperContract } from 'app/hooks'
import { useSingleCallResult } from 'app/state/multicall/hooks'
import { useMemo } from 'react'

export const useAuctionList = (type: AuctionStatus): RawAuction[] => {
  const contract = useMisoHelperContract()
  const { result } = useSingleCallResult(contract, 'getMarkets')

  return useMemo(() => {
    if (!result || !Array.isArray(result) || !(result.length > 0)) return []

    let filtered = result[0].filter((el) => !BAD_AUCTIONS.includes(el.addr))
    const currentTimestamp = Math.floor(new Date().getTime() / 1000)

    if (type === AuctionStatus.LIVE) {
      return filtered.filter(
        (auction) =>
          currentTimestamp >= parseInt(auction.startTime) &&
          currentTimestamp < parseInt(auction.endTime) &&
          !auction.finalized
      )
    } else if (type === AuctionStatus.UPCOMING) {
      return filtered.filter((auction) => currentTimestamp < parseInt(auction.startTime) && !auction.finalized)
    } else if (type === AuctionStatus.FINISHED) {
      return filtered.filter((auction) => currentTimestamp > parseInt(auction.endTime) || auction.finalized)
    }

    return filtered
  }, [result, type])
}
