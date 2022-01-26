import { useSwaps } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'

export function RecentTrades() {
  const { chainId } = useActiveWeb3React()
  const { data: swaps } = useSwaps({
    chainId,
    variables: { first: 1000, skip: 0, orderBy: 'timestamp', orderDirection: 'desc' },
    shouldFetch: !!chainId,
    swrConfig: { refreshInterval: 10000, fallbackData: [] },
  })
  return (
    <div className="flex flex-col gap-3">
      {swaps.map((swap: any, i: number) => (
        <div key={i}>Trade</div>
      ))}
    </div>
  )
}
