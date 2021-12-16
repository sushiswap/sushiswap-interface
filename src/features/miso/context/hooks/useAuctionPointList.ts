import { Interface } from '@ethersproject/abi'
import { AddressZero } from '@ethersproject/constants'
import { Currency, CurrencyAmount, Fraction, JSBI } from '@sushiswap/core-sdk'
import MISO from '@sushiswap/miso/exports/all.json'
import BASE_AUCTION_ABI from 'app/constants/abis/base-auction.json'
import { useContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
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
  return (result as string[])?.filter((el) => el !== AddressZero) || []
}

export const useAuctionPointListPoints = (
  listAddress?: string,
  address?: string,
  paymentToken?: Currency
): CurrencyAmount<Currency> | undefined => {
  const { account, chainId } = useActiveWeb3React()
  const contract = useContract(listAddress, chainId ? MISO[chainId]?.['ropsten']?.contracts.PointList.abi : undefined)
  const { result } = useSingleCallResult(contract, 'points', address ? [address] : account ? [account] : undefined)
  if (Array.isArray(result) && result.length > 0 && paymentToken) {
    const { denominator, numerator } = new Fraction(JSBI.BigInt(result[0]), 1)
    return CurrencyAmount.fromFractionalAmount(paymentToken, numerator, denominator)
  }
}
