import { Token } from '@sushiswap/core-sdk'
import LineGraph from 'app/components/LineGraph'
import { Auction } from 'app/features/miso/context/Auction'
import useAuctionCommitments from 'app/features/miso/context/hooks/useAuctionCommitments'
import { FC, useMemo, useState } from 'react'

interface AuctionChartProps {
  auction: Auction<Token, Token>
}

const AuctionChart: FC<AuctionChartProps> = ({ auction }) => {
  const commitments = useAuctionCommitments(auction)
  const auctionStarted = auction.auctionInfo.startTime.mul('1000').toNumber() <= Date.now()
  const auctionEnded = auction.auctionInfo.endTime.mul('1000').toNumber() <= Date.now()

  const graphData = useMemo(() => {
    return [
      {
        x: auction.auctionInfo.startTime.mul('1000').toNumber(),
        y: auction?.startPrice ? Number(auction.startPrice.toFixed()) : 0,
      },
      ...commitments.map((el) => ({ x: el.blockNumber, y: Number(el.amount.toFixed()) })),
      {
        x: !auctionEnded && auctionStarted ? Date.now() : auction.auctionInfo.endTime.mul('1000').toNumber(),
        y: auction?.currentPrice ? Number(auction.currentPrice.toFixed()) : 0,
      },
    ]
  }, [
    auction.auctionInfo.endTime,
    auction.auctionInfo.startTime,
    auction.currentPrice,
    auction.startPrice,
    auctionEnded,
    auctionStarted,
    commitments,
  ])

  const [selectedIndex, setSelectedIndex] = useState(graphData.length - 1)

  return (
    <div className="py-4 h-36">
      {graphData.length > 0 && (
        <LineGraph
          data={graphData}
          stroke={{ gradient: { from: '#27B0E6', to: '#FA52A0' } }}
          setSelectedIndex={setSelectedIndex}
        />
      )}
    </div>
  )
}

export default AuctionChart
