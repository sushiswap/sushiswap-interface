import { DocumentTextIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Token } from '@sushiswap/core-sdk'
import Chip from 'app/components/Chip'
import { DiscordIcon, GithubIcon, MediumIcon, RestrictedIcon, TokenomicsIcon, TwitterIcon } from 'app/components/Icon'
import Typography from 'app/components/Typography'
import AuctionDocumentsSkeleton from 'app/features/miso/AuctionDocuments/AuctionDocumentsSkeleton'
import AuctionIcon from 'app/features/miso/AuctionIcon'
import { Auction } from 'app/features/miso/context/Auction'
import { useAuctionDocuments } from 'app/features/miso/context/hooks/useAuctionDocuments'
import { AuctionTitleByTemplateId } from 'app/features/miso/context/utils'
import React, { FC } from 'react'

interface AuctionDocumentsProps {
  auction?: Auction<Token, Token>
}

const AuctionDocuments: FC<AuctionDocumentsProps> = ({ auction }) => {
  const { i18n } = useLingui()
  const [documents, setDocuments] = useAuctionDocuments(auction)

  if (!auction) return <AuctionDocumentsSkeleton />

  return (
    <>
      <div className="flex gap-4 items-center">
        <Chip label="DeFi" color="blue" />
        {auction && (
          <div className="flex gap-1.5">
            <AuctionIcon auctionTemplate={auction.template} width={18} />
            <Typography variant="sm" weight={700} className="text-secondary">
              {AuctionTitleByTemplateId(i18n)[auction.template]}
            </Typography>
          </div>
        )}

        <div className="flex gap-1.5">
          <RestrictedIcon width={18} />
          <Typography variant="sm" weight={700} className="text-secondary">
            {i18n._(t`Restricted`)}
          </Typography>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Typography variant="sm" weight={700} className="text-low-emphesis">
          {i18n._(t`Technical Information`)}
        </Typography>
        <div className="flex gap-4">
          <div className="flex gap-2">
            <DocumentTextIcon width={20} />
            <Typography variant="sm" weight={700} className="underline text-high-emphesis">
              {i18n._(t`Whitepaper`)}
            </Typography>
          </div>
          <div className="flex gap-2">
            <TokenomicsIcon width={18} />
            <Typography variant="sm" weight={700} className="underline text-high-emphesis">
              {i18n._(t`Tokenomics`)}
            </Typography>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Typography variant="sm" weight={700} className="text-low-emphesis">
          {i18n._(t`Social`)}
        </Typography>
        <div className="flex gap-5">
          <GithubIcon width={20} />
          <TwitterIcon width={20} />
          <MediumIcon width={20} />
          <DiscordIcon width={20} />
        </div>
      </div>
    </>
  )
}

export default AuctionDocuments
