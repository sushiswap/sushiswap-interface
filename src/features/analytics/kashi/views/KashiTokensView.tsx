import { useKashiTokens } from 'app/features/kashi/hooks'
import { useKashiPricesSubgraphWithLoadingIndicator } from 'app/hooks/usePricesSubgraph'
import { useDataKashiTokensWithLoadingIndicator } from 'app/services/graph/hooks/kashipairs'
import { useActiveWeb3React } from 'app/services/web3'
import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'

import TokenMarketTable from '../components/TokenMarketTable'
import TotakTokenCard from '../components/TotalTokenCard'
import { useAppContext } from '../context/AppContext'
import { KashiPairsByTokenNew } from '../types/KashiPair'

const KashiTokensView = () => {
  const { chainId } = useActiveWeb3React()
  const { loading: loadingToken, data: dataKashiPairs } = useDataKashiTokensWithLoadingIndicator({ chainId })

  const [calculating, setCalculating] = useState(true)
  const [totalAsset, setTotalAsset] = useState(BigInt(0))
  const [totalBorrow, setTotalBorrow] = useState(BigInt(0))
  const [top3MarketsBySupply, setTop3MarketsBySupply] = useState<KashiPairsByTokenNew[]>([])
  const [top3MarketsByAsset, setTop3MarketsByAsset] = useState<KashiPairsByTokenNew[]>([])
  const [top3MarketsByBorrow, setTop3MarketsByBorrow] = useState<KashiPairsByTokenNew[]>([])

  const [kashiPairsByTokens, setKashiPairsByTokens] = useState<KashiPairsByTokenNew[]>([])
  const { calculateService } = useAppContext()
  const loading = loadingToken || calculating

  const tokens = useKashiTokens()
  const { loading: loadingPrice, data: pricesMap } = useKashiPricesSubgraphWithLoadingIndicator(Object.values(tokens))

  useEffect(() => {
    if (dataKashiPairs) {
      if (dataKashiPairs.kashiPairs) {
        setDataKashiPairs()
      }
    }
  }, [dataKashiPairs, loadingPrice])

  const setDataKashiPairs = async () => {
    if (!loadingPrice) {
      const { kashiPairs } = dataKashiPairs

      const { kashiPairsByTokens, totalAsset, totalBorrow } = calculateService.calculateKashiPairPricesGroupByAssetNew(
        kashiPairs,
        pricesMap
      )
      setCalculating(false)
      kashiPairsByTokens.sort((a, b) =>
        BigNumber.from(a.totalAsset)
          .add(BigNumber.from(a.totalBorrow))
          .gte(BigNumber.from(b.totalAsset).add(BigNumber.from(b.totalBorrow)))
          ? -1
          : 1
      )

      const kashiPairsByTokensSortedByAsset = [...kashiPairsByTokens].sort((a, b) =>
        a.totalAsset > b.totalAsset ? -1 : 1
      )

      const kashiPairsByTokensSortedByBorrow = [...kashiPairsByTokens].sort((a, b) =>
        a.totalBorrow > b.totalBorrow ? -1 : 1
      )

      setTop3MarketsBySupply(kashiPairsByTokens.slice(0, kashiPairsByTokens.length < 3 ? kashiPairsByTokens.length : 3))
      setTop3MarketsByAsset(
        kashiPairsByTokensSortedByAsset.slice(
          0,
          kashiPairsByTokensSortedByAsset.length < 3 ? kashiPairsByTokensSortedByAsset.length : 3
        )
      )
      setTop3MarketsByBorrow(
        kashiPairsByTokensSortedByBorrow.slice(
          0,
          kashiPairsByTokensSortedByBorrow.length < 3 ? kashiPairsByTokensSortedByBorrow.length : 3
        )
      )

      setKashiPairsByTokens(kashiPairsByTokens)
      setTotalAsset(totalAsset.toBigInt())
      setTotalBorrow(totalBorrow.toBigInt())
    }
  }

  return (
    <>
      {/* <Charts data={kashiPairsDayData} loading={loadingDayData} /> */}
      <div className="container grid grid-cols-1 gap-4 mx-auto lg:grid-cols-3">
        <TotakTokenCard
          containerClass="col-span-1"
          loading={loading}
          borrow="supply"
          data={{
            amount: totalAsset + totalBorrow,
            volumeIn24H: BigInt(0),
            totalUsers: BigInt('0'),
            topMarkets: top3MarketsBySupply,
          }}
        />
        <TotakTokenCard
          containerClass="col-span-1"
          loading={loading}
          borrow="asset"
          data={{
            amount: totalAsset,
            volumeIn24H: BigInt(0),
            totalUsers: BigInt('0'),
            topMarkets: top3MarketsByAsset,
          }}
        />
        <TotakTokenCard
          containerClass="col-span-1"
          loading={loading}
          borrow="borrow"
          data={{
            amount: totalBorrow,
            volumeIn24H: BigInt(0),
            totalUsers: BigInt('0'),
            topMarkets: top3MarketsByBorrow,
          }}
        />
      </div>
      <div className="container mx-auto mt-4 mb-24">
        <TokenMarketTable loading={loading} data={kashiPairsByTokens} />
      </div>
    </>
  )
}
export default KashiTokensView
