import { Token } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import useInterval from 'app/hooks/useInterval'
import { FC, useState } from 'react'

import { Auction } from '../context/Auction'

const AuctionCardTimer: FC<{ auction: Auction<Token, Token> }> = ({ auction }) => {
  const [remaining, setRemaining] = useState<{ days: number; hours: number; minutes: number; seconds: number }>()

  useInterval(() => {
    setRemaining(auction.remainingTime)
  }, 1000)

  if (remaining) {
    return (
      <div className="flex gap-2">
        <div className="flex items-baseline gap-2">
          <Typography variant="sm" weight={700} className="text-mono">
            {remaining.days}D
          </Typography>
          <Typography variant="xxs" weight={700} className="text-mono text-secondary">
            :
          </Typography>
        </div>
        <div className="flex items-baseline gap-2">
          <Typography variant="sm" weight={700} className="text-mono">
            {remaining.hours}H
          </Typography>
          <Typography variant="xxs" weight={700} className="text-mono text-secondary">
            :
          </Typography>
        </div>
        <div className="flex items-baseline gap-2">
          <Typography variant="sm" weight={700} className="text-mono">
            {remaining.minutes}M
          </Typography>
          <Typography variant="xxs" weight={700} className="text-mono text-secondary">
            :
          </Typography>
        </div>
        <div className="flex items-baseline gap-2">
          <Typography variant="sm" weight={700} className="text-mono">
            {remaining.seconds}S
          </Typography>
        </div>
      </div>
    )
  }

  return <></>
}

export default AuctionCardTimer
