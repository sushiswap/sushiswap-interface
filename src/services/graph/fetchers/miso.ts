import { pager } from 'app/services/graph'
import { misoCommitmentsQuery } from 'app/services/graph/queries/miso'

export const getMisoCommitments = async (auctionId: string) => {
  return await pager('https://api.thegraph.com/subgraphs/name/sushiswap/kovan-miso', misoCommitmentsQuery, {
    auctionId: auctionId.toLowerCase(),
  })
}
