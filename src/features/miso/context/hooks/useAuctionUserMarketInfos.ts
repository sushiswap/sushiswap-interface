import { RawMarketInfo } from 'app/features/miso/context/types'
import { useMisoHelperContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useSingleContractMultipleData } from 'app/state/multicall/hooks'

export const useAuctionUserMarketInfos = (addresses: string[], owner?: string): (RawMarketInfo | undefined)[] => {
  const { account } = useActiveWeb3React()
  const contract = useMisoHelperContract()
  const results = useSingleContractMultipleData(
    contract,
    'getUserMarketInfo',
    addresses.map((el) => [el, owner ?? account ?? undefined])
  )

  if (results && Array.isArray(results) && results.length === addresses.length) {
    return results.map<RawMarketInfo | undefined>((el) => {
      if (el.result && Array.isArray(el.result) && el.result.length > 0) {
        return el.result[0]
      }

      return undefined
    })
  }

  return Array(addresses.length).fill(undefined)
}
