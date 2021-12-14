import AuctionChartCrowdsale from 'app/features/miso/AuctionChart/AuctionChartCrowdsale'
import AuctionChartDutch from 'app/features/miso/AuctionChart/AuctionChartDutch'
import { Auction } from 'app/features/miso/context/Auction'
import { AuctionTemplate } from 'app/features/miso/context/types'
import { FC } from 'react'

interface AuctionChartProps {
  auction: Auction
}
const AuctionChart: FC<AuctionChartProps> = ({ auction }) => {
  if (auction.template === AuctionTemplate.DUTCH_AUCTION) {
    return <AuctionChartDutch auction={auction} />
  }

  return <AuctionChartCrowdsale auction={auction} />
}

export default AuctionChart
