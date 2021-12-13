import { Token } from '@sushiswap/core-sdk'
import { Auction } from 'app/features/miso/context/Auction'
import { FC } from 'react'

interface AuctionDetailsTabProps {
  auction: Auction<Token, Token>
  active: boolean
}

const AuctionDetailsTab: FC<AuctionDetailsTabProps> = ({ auction, active }) => {
  return <span />
}

export default AuctionDetailsTab
