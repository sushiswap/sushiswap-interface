import { Price, Token } from '@sushiswap/core-sdk'
import useInterval from 'app/hooks/useInterval'
import { FC, useState } from 'react'

import { Auction } from '../context/Auction'

const AuctionCardPrice: FC<{ auction: Auction<Token, Token> }> = ({ auction }) => {
  const [price, setPrice] = useState<Price<Token, Token> | undefined>()

  useInterval(() => {
    setPrice(auction.currentPrice)
  }, 5000)

  if (price) {
    return (
      <>
        {price?.toSignificant(6)} {price?.quoteCurrency.symbol}
      </>
    )
  }

  return <></>
}

export default AuctionCardPrice
