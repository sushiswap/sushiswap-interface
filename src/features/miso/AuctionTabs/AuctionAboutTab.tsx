import { Auction } from 'app/features/miso/context/Auction'
import { FC } from 'react'

interface AuctionAboutTabProps {
  auction: Auction
  active: boolean
}

const AuctionAboutTab: FC<AuctionAboutTabProps> = ({ auction, active }) => {
  return <span />
}

export default AuctionAboutTab
