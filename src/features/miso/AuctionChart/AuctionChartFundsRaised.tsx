import LineGraph from 'app/components/LineGraph'
import { useState } from 'react'

export const FundsRaisedChart = ({ auction }) => {
  // const auctionCommitments = useAuctionCommitments(auction)
  const [selectedBlock, setSelectedBlock] = useState(undefined)
  const auctionCommitments = [
    { x: 0, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 3 },
    { x: 4, y: 4 },
    { x: 5, y: 5 },
    { x: 6, y: 10 },
    { x: 7, y: 12 },
  ]

  return (
    <>
      {true ? (
        <div className="w-full h-full relative min-h-[234px] text-green px-4 pb-20 box-border">
          {/* <h1>Commitments {auctionCommitments[i]}</h1> */}
          <h1>Commitments {auctionCommitments[selectedBlock]?.y}</h1>
          <LineGraph
            data={auctionCommitments}
            stroke={{ solid: '#7CFF6B' }}
            strokeWidth={2}
            setSelectedIndex={(i) => setSelectedBlock(i)}
          />
        </div>
      ) : (
        <div className="w-full h-full relative min-h-[234px] flex items-center justify-center text-gray-200">
          No commitments yet
        </div>
      )}
    </>
  )
}
