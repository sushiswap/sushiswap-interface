import { AddressZero } from '@ethersproject/constants'
import { Token } from '@sushiswap/core-sdk'
import { useAuctionDocuments } from 'app/features/miso/context/hooks/useAuctionDocuments'
import { useAuctionEnded } from 'app/features/miso/context/hooks/useAuctionEnded'
import {
  useAuctionDetails,
  useAuctionHelperInfo,
  useAuctionLauncherDetails,
} from 'app/features/miso/context/hooks/useAuctionInfo'
import { useAuctionMarketTemplateIds } from 'app/features/miso/context/hooks/useAuctionMarketTemplateIds'
import { useAuctionPointLists } from 'app/features/miso/context/hooks/useAuctionPointList'
import { useAuctionRawInfos } from 'app/features/miso/context/hooks/useAuctionRawInfo'
import { AuctionStatus } from 'app/features/miso/context/types'
import { getNativeOrToken, getStatusByTimestamp } from 'app/features/miso/context/utils'
import { useActiveWeb3React } from 'app/services/web3'
import { useBlockTimestamp } from 'app/state/application/hooks'
import { useMemo } from 'react'

import { Auction } from '../Auction'
import { useAuctionList } from './useAuctionList'
import { useAuctionUserMarketInfos } from './useAuctionUserMarketInfos'

export const useAuctions = (type: AuctionStatus, owner?: string): (Auction | undefined)[] | undefined => {
  const { chainId } = useActiveWeb3React()
  const auctions = useAuctionList(type)
  const addresses = useMemo(() => auctions.map((el) => el.addr), [auctions])
  const userMarketInfos = useAuctionUserMarketInfos(addresses, owner)
  const auctionTemplateIds = useAuctionMarketTemplateIds(addresses)
  const auctionInfos = useAuctionRawInfos(addresses, auctionTemplateIds)
  const auctionDocuments = useAuctionDocuments(addresses)
  const pointListAddresses = useAuctionPointLists(addresses)
  const blockTimestamp = useBlockTimestamp()

  return useMemo(() => {
    if (!chainId) return Array(Math.min(auctions.length, 6)).fill(undefined)

    return auctions
      .reduce<(Auction | undefined)[]>((acc, el, index) => {
        const template = auctionTemplateIds[index]?.toNumber()
        const auctionInfo = auctionInfos[index]
        const marketInfo = userMarketInfos[index]
        const auctionDocs = auctionDocuments[index]
        const pointListAddress = pointListAddresses[index]
        const paymentToken = auctionInfo ? getNativeOrToken(chainId, auctionInfo.paymentCurrencyInfo) : undefined

        // If owner is set and we're not owner of this auction, filter out
        if (owner && !marketInfo?.isAdmin) {
          return acc
        }

        if (template && auctionInfo && paymentToken && auctionDocs && pointListAddress && blockTimestamp) {
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
              liquidityToken: undefined, // for performance reasons since this hook is only used on overview screen
              auctionInfo,
              marketInfo,
              launcherInfo: undefined, // for performance reasons since this hook is only used on overview screen
              auctionDocuments: auctionDocs,
              pointListAddress,
              status: getStatusByTimestamp(blockTimestamp, auctionInfo),
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
  }, [
    auctionDocuments,
    auctionInfos,
    auctionTemplateIds,
    auctions,
    blockTimestamp,
    chainId,
    owner,
    pointListAddresses,
    type,
    userMarketInfos,
  ])
}

export const useAuction = (address?: string, owner?: string) => {
  const { chainId } = useActiveWeb3React()
  const blockTimestamp = useBlockTimestamp()

  const {
    marketTemplateId,
    pointListAddress,
    auctionLauncherAddress,
    loading: loadingDetails,
  } = useAuctionDetails(address)

  const auctionEnded = useAuctionEnded(address, marketTemplateId)

  const { launcherInfo, lpTokenAddress } = useAuctionLauncherDetails(auctionLauncherAddress)

  const {
    auctionDocuments,
    marketInfo,
    auctionInfo,
    loading: loadingInfo,
  } = useAuctionHelperInfo(address, marketTemplateId, owner ?? AddressZero)

  return useMemo(() => {
    if (loadingDetails || loadingInfo) return { loading: true, auction: undefined }
    if (!blockTimestamp || !chainId || !marketTemplateId || !auctionInfo || !auctionDocuments)
      return { loading: false, auction: undefined }

    const paymentToken = getNativeOrToken(chainId, auctionInfo.paymentCurrencyInfo)

    return {
      loading: false,
      auction: new Auction({
        template: marketTemplateId.toNumber(),
        auctionToken: new Token(
          chainId,
          auctionInfo.tokenInfo.addr,
          auctionInfo.tokenInfo.decimals.toNumber(),
          auctionInfo.tokenInfo.symbol,
          auctionInfo.tokenInfo.name
        ),
        liquidityToken: lpTokenAddress
          ? new Token(chainId, lpTokenAddress, 18, 'SLP', 'Sushiswap LP Token')
          : undefined,
        paymentToken,
        auctionInfo,
        marketInfo,
        launcherInfo,
        auctionDocuments,
        pointListAddress,
        status: getStatusByTimestamp(blockTimestamp, auctionInfo, auctionEnded),
      }),
    }
  }, [
    auctionDocuments,
    auctionEnded,
    auctionInfo,
    blockTimestamp,
    chainId,
    launcherInfo,
    loadingDetails,
    loadingInfo,
    lpTokenAddress,
    marketInfo,
    marketTemplateId,
    pointListAddress,
  ])
}

export default useAuction
