import { AuctionTemplate, StoreSlice } from 'app/features/miso/context/types'

export interface IAuctionDetails {
  auctionType: AuctionTemplate
  fixedPrice: number | null
  minimumTarget: number | null
  minimumRaised: number | null
  startPrice: number | null
  endPrice: number | null
}

export const auctionDetailsDefaultValues = {
  auctionType: AuctionTemplate.NOT_SET,
  fixedPrice: null,
  minimumRaised: null,
  minimumTarget: null,
  startPrice: null,
  endPrice: null,
}

interface IAuctionDetailsSlice extends IAuctionDetails {
  setAuctionDetails: (_: IAuctionDetails) => void
}

export const createAuctionDetailsSlice: StoreSlice<IAuctionDetailsSlice> = (set) => ({
  ...auctionDetailsDefaultValues,
  setAuctionDetails: (newState) => set(() => newState),
})
