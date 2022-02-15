import { Auction } from 'app/features/miso/context/Auction'
import {
  AuctionFetchState,
  useContractCallMisoCommitments,
  useSubgraphMisoCommitments,
} from 'app/services/graph/hooks/miso'
import { useMemo } from 'react'

export const useAuctionCommitments = (auction: Auction): AuctionFetchState => {
  const subgraphResult = useSubgraphMisoCommitments(auction)
  const contractResult = useContractCallMisoCommitments({ auction, shouldFetch: subgraphResult.error })
  return useMemo(() => (!subgraphResult.error ? subgraphResult : contractResult), [contractResult, subgraphResult])
}
