import { t } from '@lingui/macro'
import { ChainId } from '@sushiswap/core-sdk'
import MISO from '@sushiswap/miso/exports/all.json'
import { AuctionTemplate } from 'app/features/miso/context/types'

export const AuctionStatusById = (i18n) => ({
  1: i18n._(t`LIVE`),
  2: i18n._(t`UPCOMING`),
  3: i18n._(t`FINISHED`),
})

export const AuctionTitleByTemplateId = (i18n) => ({
  1: i18n._(t`Crowdsale`),
  2: i18n._(t`Dutch Auction`),
  3: i18n._(t`Batch Auction`),
})

// TODO ramin: remove ropsten
export const MisoAbiByTemplateId = (chainId: ChainId, templateId: AuctionTemplate) => {
  return {
    1: MISO[chainId]?.['ropsten']?.contracts.Crowdsale.abi,
    2: MISO[chainId]?.['ropsten']?.contracts.DutchAuction.abi,
    3: MISO[chainId]?.['ropsten']?.contracts.BatchAuction.abi,
  }[templateId]
}
