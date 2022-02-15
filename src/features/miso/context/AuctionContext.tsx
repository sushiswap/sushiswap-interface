import Typography from 'app/components/Typography'
import { createContext, FC, useContext } from 'react'

import { Auction } from './Auction'

interface AuctionContext {
  loading: boolean
  auction?: Auction
}

const Context = createContext<AuctionContext>({ loading: true, auction: undefined })

export const AuctionContext: FC<AuctionContext> = ({ children, auction, loading }) => {
  if (!loading && !auction) return <Typography>404</Typography>
  if (loading && !auction) return <Context.Provider value={{ auction, loading }}>{children}</Context.Provider>
  if (!loading && auction) return <Context.Provider value={{ auction, loading }}>{children}</Context.Provider>

  throw new Error("Shouldn't be possible")
}

export const useAuctionContext = () => {
  return useContext(Context)
}
