import { Contract } from '@ethersproject/contracts'

import { useContract } from '../../hooks/useContract'

import AUCTION_ABI from '../constants/BaseAuction.json'
import CROWDSALE_ABI from '../constants/Crowdsale.json'
import DUTCH_ABI from '../constants/DutchAuction.json'
import BATCH_ABI from '../constants/BatchAuction.json'

export function useAuctionContract(address: string, withSignerIfPossible = true): Contract | null {
    return useContract(address, AUCTION_ABI, withSignerIfPossible)
}

export function useCrowdSaleAuctionContract(address: string, withSignerIfPossible = true): Contract | null {
    return useContract(address, CROWDSALE_ABI, withSignerIfPossible)
}

export function useDutchAuctionContract(address: string, withSignerIfPossible = true): Contract | null {
    return useContract(address, DUTCH_ABI, withSignerIfPossible)
}

export function useBatchAuctionContract(address: string, withSignerIfPossible = true): Contract | null {
    return useContract(address, BATCH_ABI, withSignerIfPossible)
}
