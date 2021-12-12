import { Interface } from '@ethersproject/abi'
import BASE_AUCTION_ABI from 'app/constants/abis/base-auction.json'
import { useMultipleContractSingleData } from 'app/state/multicall/hooks'
import { useMemo } from 'react'

const AUCTION_INTERFACE = new Interface(BASE_AUCTION_ABI)

const useAuctionsMarketTemplateId = (auctions: string[]) => {
  const addresses = useMemo(() => auctions.map((el) => el), [auctions])
  return useMultipleContractSingleData(addresses, AUCTION_INTERFACE, 'marketTemplate')
}

export default useAuctionsMarketTemplateId
