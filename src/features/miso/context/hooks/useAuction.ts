import { Token } from '@sushiswap/core-sdk'
import useAuctionMarketTemplateId, {
  useAuctionMarketTemplateIds,
} from 'app/features/miso/context/hooks/useAuctionMarketTemplateId'
import useAuctionRawInfo, { useAuctionRawInfos } from 'app/features/miso/context/hooks/useAuctionRawInfo'
import { AuctionStatus } from 'app/features/miso/context/types'
import { getNativeOrToken } from 'app/features/miso/context/utils'
import { useActiveWeb3React } from 'app/services/web3'
import { useMemo } from 'react'

import { Auction } from '../Auction'
import { useAuctionList } from './useAuctionList'
import { useAuctionUserMarketInfo, useAuctionUserMarketInfos } from './useAuctionUserMarketInfo'

export const useAuctions = (type: AuctionStatus, owner?: string): Auction[] | undefined => {
  const { chainId } = useActiveWeb3React()
  const auctions = useAuctionList(type)
  const addresses = useMemo(() => auctions.map((el) => el.addr), [auctions])
  const userMarketInfos = useAuctionUserMarketInfos(addresses, owner)
  const auctionTemplateIds = useAuctionMarketTemplateIds(addresses)
  const auctionInfos = useAuctionRawInfos(addresses, auctionTemplateIds)

  return useMemo(() => {
    if (!chainId) return Array(Math.min(auctions.length, 6)).fill(undefined)

    return auctions.reduce<Auction[]>((acc, el, index) => {
      const template = auctionTemplateIds[index]?.toNumber()
      const auctionInfo = auctionInfos[index]
      const userMarketInfo = userMarketInfos[index]
      const paymentToken = auctionInfo ? getNativeOrToken(chainId, auctionInfo.paymentCurrencyInfo) : undefined

      console.log(owner)
      // If owner is set and we're not owner of this auction, filter out
      if (owner && !userMarketInfo?.isAdmin) {
        return acc
      }

      if (userMarketInfo && template && auctionInfo && paymentToken) {
        acc.push(
          new Auction({
            isOwner: userMarketInfo.isAdmin,
            template,
            auctionToken: new Token(
              chainId,
              el.tokenInfo.addr,
              el.tokenInfo.decimals.toNumber(),
              el.tokenInfo.symbol,
              el.tokenInfo.name
            ),
            paymentToken,
            auctionInfo,
            claimInfo: {
              tokensClaimable: userMarketInfo.tokensClaimable,
              claimed: userMarketInfo.claimed,
            },
          })
        )
      }

      return acc
    }, [])
  }, [auctionInfos, auctionTemplateIds, auctions, chainId, owner, userMarketInfos])
}

export const useAuction = (address: string) => {
  const { chainId, account } = useActiveWeb3React()
  const marketTemplateId = useAuctionMarketTemplateId(address)
  const auctionInfo = useAuctionRawInfo(address, marketTemplateId)
  const userMarketInfo = useAuctionUserMarketInfo(address, account ?? undefined)

  return useMemo(() => {
    if (!chainId || !marketTemplateId || !auctionInfo || !userMarketInfo) return
    const paymentToken = getNativeOrToken(chainId, auctionInfo.paymentCurrencyInfo)
    const { isAdmin, claimed, tokensClaimable } = userMarketInfo

    return new Auction({
      template: marketTemplateId.toNumber(),
      auctionToken: new Token(
        chainId,
        auctionInfo.tokenInfo.addr,
        auctionInfo.tokenInfo.decimals.toNumber(),
        auctionInfo.tokenInfo.symbol,
        auctionInfo.tokenInfo.name
      ),
      paymentToken,
      auctionInfo,
      isOwner: isAdmin,
      claimInfo: { claimed, tokensClaimable },
    })
  }, [auctionInfo, chainId, marketTemplateId, userMarketInfo])
}

export default useAuction
