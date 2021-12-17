import { Token } from '@sushiswap/core-sdk'
import { useAuctionDocument, useAuctionDocuments } from 'app/features/miso/context/hooks/useAuctionDocuments'
import useAuctionMarketTemplateId, {
  useAuctionMarketTemplateIds,
} from 'app/features/miso/context/hooks/useAuctionMarketTemplateId'
import { useAuctionPointList, useAuctionPointLists } from 'app/features/miso/context/hooks/useAuctionPointList'
import useAuctionRawInfo, { useAuctionRawInfos } from 'app/features/miso/context/hooks/useAuctionRawInfo'
import { AuctionStatus } from 'app/features/miso/context/types'
import { getNativeOrToken } from 'app/features/miso/context/utils'
import { useActiveWeb3React } from 'app/services/web3'
import { useMemo } from 'react'

import { Auction } from '../Auction'
import { useAuctionList } from './useAuctionList'
import { useAuctionUserMarketInfo, useAuctionUserMarketInfos } from './useAuctionUserMarketInfo'

export const useAuctions = (type: AuctionStatus, owner?: string): (Auction | undefined)[] | undefined => {
  const { chainId } = useActiveWeb3React()
  const auctions = useAuctionList(type)
  const addresses = useMemo(() => auctions.map((el) => el.addr), [auctions])
  const userMarketInfos = useAuctionUserMarketInfos(addresses, owner)
  const auctionTemplateIds = useAuctionMarketTemplateIds(addresses)
  const auctionInfos = useAuctionRawInfos(addresses, auctionTemplateIds)
  const auctionDocuments = useAuctionDocuments(addresses)
  const whitelists = useAuctionPointLists(addresses)
  return useMemo(() => {
    if (!chainId) return Array(Math.min(auctions.length, 6)).fill(undefined)

    return auctions
      .reduce<(Auction | undefined)[]>((acc, el, index) => {
        const template = auctionTemplateIds[index]?.toNumber()
        const auctionInfo = auctionInfos[index]
        const marketInfo = userMarketInfos[index]
        const auctionDocs = auctionDocuments[index]
        const whitelist = whitelists[index]
        const paymentToken = auctionInfo ? getNativeOrToken(chainId, auctionInfo.paymentCurrencyInfo) : undefined

        // If owner is set and we're not owner of this auction, filter out
        if (owner && !marketInfo?.isAdmin) {
          return acc
        }

        if (template && auctionInfo && paymentToken && auctionDocs && whitelist) {
          acc.push(
            new Auction({
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
              marketInfo,
              auctionDocuments: auctionDocs,
              whitelist,
            })
          )
        } else {
          acc.push(undefined)
        }

        return acc
      }, [])
      .sort((a, b) => {
        if (!a || !b) return 0

        // Sort first expiring auction first
        if (type === AuctionStatus.LIVE || type === AuctionStatus.UPCOMING)
          return a.auctionInfo.endTime.toNumber() <= b.auctionInfo.endTime.toNumber() ? -1 : 1

        // Show latest expired first
        return a.auctionInfo.endTime.toNumber() <= b.auctionInfo.endTime.toNumber() ? 1 : -1
      })
  }, [auctionDocuments, auctionInfos, auctionTemplateIds, auctions, chainId, owner, type, userMarketInfos, whitelists])
}

export const useAuction = (address: string, owner?: string) => {
  const { chainId } = useActiveWeb3React()
  const marketTemplateId = useAuctionMarketTemplateId(address)
  const auctionInfo = useAuctionRawInfo(address, marketTemplateId)
  const marketInfo = useAuctionUserMarketInfo(address, owner ?? undefined)
  const auctionDocuments = useAuctionDocument(address)
  const whitelist = useAuctionPointList(address)

  return useMemo(() => {
    if (!chainId || !marketTemplateId || !auctionInfo || !auctionDocuments) return
    const paymentToken = getNativeOrToken(chainId, auctionInfo.paymentCurrencyInfo)

    if (owner && !marketInfo?.isAdmin) return undefined

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
      marketInfo,
      auctionDocuments,
      whitelist,
    })
  }, [auctionDocuments, auctionInfo, chainId, marketInfo, marketTemplateId, owner, whitelist])
}

export default useAuction
