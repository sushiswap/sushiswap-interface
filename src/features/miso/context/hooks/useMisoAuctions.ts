import { NATIVE, Token } from '@sushiswap/core-sdk'
import { BAD_AUCTIONS, NATIVE_PAYMENT_TOKEN } from 'app/features/miso/context/constants'
import useAuctionsInfo from 'app/features/miso/context/hooks/useAuctionsInfo'
import useAuctionsMarketTemplateId from 'app/features/miso/context/hooks/useAuctionsMarketTemplateId'
import { AuctionStatus, AuctionTemplate, RawAuction, RawAuctionInfo } from 'app/features/miso/context/types'
import { useMisoHelperContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useBlockNumber } from 'app/state/application/hooks'
import { useSingleContractMultipleData } from 'app/state/multicall/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Auction } from '../Auction'

export const useMisoAuctions = (type: AuctionStatus, owner?: string): Auction[] | undefined => {
  const { chainId } = useActiveWeb3React()
  const contract = useMisoHelperContract()
  const blockNumber = useBlockNumber()
  const [rawAuctions, setRawAuctions] = useState<RawAuction[]>([])
  const rawAuctionAddresses = useMemo(() => rawAuctions.map((el) => el.addr), [rawAuctions])

  // Get all markets info
  const userMarketInput = useMemo(() => rawAuctions.map((el) => [el.addr, owner]), [rawAuctions, owner])
  const userMarketInputResult = useSingleContractMultipleData(contract, 'getUserMarketInfo', userMarketInput)

  // Get all template ids
  const auctionTemplateIds = useAuctionsMarketTemplateId(rawAuctionAddresses)

  // Get all auction info
  const auctionInfoInput = useMemo(
    () =>
      auctionTemplateIds.every((el) => el.valid && !el.loading) ? auctionTemplateIds.map((el) => el.result?.[0]) : [],
    [auctionTemplateIds]
  )
  const auctionInfoInputResult = useAuctionsInfo(rawAuctionAddresses, auctionInfoInput)

  const fetchAuctions = useCallback(async () => {
    if (!contract) return []

    const auctions = await contract.getMarkets()
    let filtered = auctions?.filter((el) => !BAD_AUCTIONS.includes(el.addr))
    if (type === AuctionStatus.LIVE) {
      filtered = filtered.filter((auction) => {
        const currentTimestamp = Math.floor(new Date().getTime() / 1000)
        return (
          currentTimestamp >= parseInt(auction.startTime) &&
          currentTimestamp < parseInt(auction.endTime) &&
          !auction.finalized
        )
      })
    } else if (type === AuctionStatus.UPCOMING) {
      filtered = filtered.filter((auction) => {
        const currentTimestamp = Math.floor(new Date().getTime() / 1000)
        return currentTimestamp < parseInt(auction.startTime) && !auction.finalized
      })
    } else if (type === AuctionStatus.FINISHED) {
      filtered = filtered.filter((auction) => {
        const currentTimestamp = Math.floor(new Date().getTime() / 1000)
        return currentTimestamp > parseInt(auction.endTime) || auction.finalized
      })
    }

    return filtered
  }, [contract, type])

  useEffect(() => {
    fetchAuctions().then((auctions) => setRawAuctions(auctions))
  }, [fetchAuctions, blockNumber])

  const filteredRawAuctions = useMemo(() => {
    if (owner) {
      if (
        rawAuctions.length === userMarketInputResult.length &&
        userMarketInputResult.every((el) => el.valid && !el.loading)
      ) {
        return rawAuctions.reduce<RawAuction[]>((acc, auction, index) => {
          const { isAdmin } = userMarketInputResult[index].result?.[0]
          if (isAdmin) acc.push(auction)

          return acc
        }, [])
      } else return undefined
    }

    return rawAuctions
  }, [rawAuctions, userMarketInputResult, owner])

  return useMemo(() => {
    if (
      chainId &&
      auctionTemplateIds &&
      auctionInfoInputResult &&
      auctionTemplateIds.every((el) => el.valid && !el.loading) &&
      auctionInfoInputResult.every((el) => el.valid && !el.loading)
    ) {
      return filteredRawAuctions?.map((el, index) => {
        const template: AuctionTemplate = auctionTemplateIds[index].result[0].toNumber()
        const auctionInfo: RawAuctionInfo = auctionInfoInputResult[index].result[0]
        const paymentToken =
          auctionInfo.paymentCurrencyInfo.addr === NATIVE_PAYMENT_TOKEN
            ? NATIVE[chainId]
            : new Token(
                chainId,
                auctionInfo.paymentCurrencyInfo.addr,
                auctionInfo.paymentCurrencyInfo.decimals.toNumber(),
                auctionInfo.paymentCurrencyInfo.symbol,
                auctionInfo.paymentCurrencyInfo.name
              )

        return new Auction({
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
        })
      })
    }

    return Array(Math.min(rawAuctions.length, 6)).fill(undefined)
  }, [auctionInfoInputResult, auctionTemplateIds, chainId, filteredRawAuctions, rawAuctions.length])
}

export const useMisoAuction = (address: string) => {
  const { chainId } = useActiveWeb3React()
  const [auctionTemplateId] = useAuctionsMarketTemplateId([address])
  const auctionInfoInput = useMemo(
    () => (auctionTemplateId && auctionTemplateId.result ? [auctionTemplateId.result[0]] : []),
    [auctionTemplateId]
  )
  const [auctionInfoInputResult] = useAuctionsInfo([address], auctionInfoInput)

  return useMemo(() => {
    if (!chainId || !auctionTemplateId.result || !auctionInfoInputResult.result) return
    const template: AuctionTemplate = auctionTemplateId.result?.[0].toNumber()
    const auctionInfo: RawAuctionInfo = auctionInfoInputResult.result?.[0]

    const paymentToken =
      auctionInfo.paymentCurrencyInfo.addr === NATIVE_PAYMENT_TOKEN
        ? NATIVE[chainId]
        : new Token(
            chainId,
            auctionInfo.paymentCurrencyInfo.addr,
            auctionInfo.paymentCurrencyInfo.decimals.toNumber(),
            auctionInfo.paymentCurrencyInfo.symbol,
            auctionInfo.paymentCurrencyInfo.name
          )

    return new Auction({
      template,
      auctionToken: new Token(
        chainId,
        auctionInfo.tokenInfo.addr,
        auctionInfo.tokenInfo.decimals.toNumber(),
        auctionInfo.tokenInfo.symbol,
        auctionInfo.tokenInfo.name
      ),
      paymentToken,
      auctionInfo,
    })
  }, [auctionInfoInputResult, auctionTemplateId, chainId])
}

export default useMisoAuctions
