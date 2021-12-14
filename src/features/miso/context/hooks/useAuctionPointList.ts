import { Interface } from '@ethersproject/abi'
import { AddressZero } from '@ethersproject/constants'
import BASE_AUCTION_ABI from 'app/constants/abis/base-auction.json'
import { useContract } from 'app/hooks'
import { useMultipleContractSingleData, useSingleCallResult } from 'app/state/multicall/hooks'

export const useAuctionPointLists = (addresses: string[]) => {
  const results = useMultipleContractSingleData(addresses, new Interface(BASE_AUCTION_ABI), 'pointList')
  if (results && Array.isArray(results) && results.length === addresses.length) {
    return results.map<string[]>((el) => {
      return (el.result as string[])?.filter((el) => el !== AddressZero) || []
    })
  }

  return Array(addresses.length).fill([])
}

export const useAuctionPointList = (address?: string): string[] => {
  const contract = useContract(address, new Interface(BASE_AUCTION_ABI))
  const { result } = useSingleCallResult(contract, 'pointList', [])
  console.log(result)
  return (result as string[])?.filter((el) => el !== AddressZero) || []
}
