import { Auction } from 'app/features/miso/context/Auction'
import { MisoAbiByTemplateId } from 'app/features/miso/context/utils'
import { useContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useSingleCallResult } from 'app/state/multicall/hooks'

export const useAuctionsPointList = (auction?: Auction): string[] => {
  const { chainId } = useActiveWeb3React()
  const contract = useContract(
    auction ? auction.auctionInfo.addr : undefined,
    chainId && auction ? MisoAbiByTemplateId(chainId, auction.template) : undefined
  )
  const { result } = useSingleCallResult(contract, 'pointList', [])
  return (result as string[]) || []
}
