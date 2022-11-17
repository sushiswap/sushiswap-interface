import { useKashiTokens } from 'app/features/kashi/hooks'
import { useKashiPricesSubgraphWithLoadingIndicator } from 'app/hooks/usePricesSubgraph'
import {
  useDataKashiPairsDayDataWithLoadingIndicator,
  useDataKashiPairsWithLoadingIndicator,
} from 'app/services/graph/hooks/kashipairs'
import { useActiveWeb3React } from 'app/services/web3'
import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'

import PairMarketTable from '../components/PairMarketTable'
import TotalCard from '../components/TotalCard'
import TotalCompareChart from '../components/TotalCompareChart'
import TotalDayDataChart from '../components/TotalDayDataChart'
import { useAppContext } from '../context/AppContext'
import { KashiPairNew } from '../types/KashiPair'
import { KashiPairDayData, KashiPairDayDataMap } from '../types/KashiPairDayData'

const KashiPairsView = () => {
  const { chainId } = useActiveWeb3React()
  const { loading: loadingKashiPairs, data: dataKashiPairs } = useDataKashiPairsWithLoadingIndicator({ chainId })

  const { loading: loadingKashiPairsDayData0, data: dataKashiPairsDayData0 } =
    useDataKashiPairsDayDataWithLoadingIndicator({
      chainId,
      variables: { skip: 0 },
    })

  const { loading: loadingKashiPairsDayData1, data: dataKashiPairsDayData1 } =
    useDataKashiPairsDayDataWithLoadingIndicator({
      chainId,
      variables: { skip: 1000 },
    })

  const [kashiPairsDayData, setKashiPairsDayData] = useState<KashiPairDayDataMap[]>([])

  const [calculating, setCalculating] = useState(true)
  //const [pricesMap, setPricesMap] = useState<{ [key: string]: BigInt }>({})
  const [kashiPairs, setKashiPairs] = useState<KashiPairNew[]>([] as KashiPairNew[])
  const { calculateService } = useAppContext()

  const [totalAssetsAmount, setTotalAssetsAmount] = useState(BigInt(0))
  const [totalBorrowsAmount, setTotalBorrowsAmount] = useState(BigInt(0))

  const [top3MarketsBySupply, setTop3MarketsBySupply] = useState<KashiPairNew[]>([])
  const [top3MarketsByAsset, setTop3MarketsByAsset] = useState<KashiPairNew[]>([])
  const [top3MarketsByBorrow, setTop3MarketsByBorrow] = useState<KashiPairNew[]>([])

  const loading = calculating || loadingKashiPairs
  const loadingDayData = loading || loadingKashiPairsDayData0 || loadingKashiPairsDayData1

  const tokens = useKashiTokens()
  const { loading: loadingPrice, data: pricesMap } = useKashiPricesSubgraphWithLoadingIndicator(Object.values(tokens))

  useEffect(() => {
    if (dataKashiPairs) {
      if (dataKashiPairs.kashiPairs) {
        setKashiPairsData(dataKashiPairs.kashiPairs)
      }
    }
  }, [dataKashiPairs, loadingPrice])

  const setKashiPairsData = async (kashiPairsData: KashiPairNew[]) => {
    if (!loadingPrice) {
      const {
        totalAsset: totalAssetsValue,
        totalBorrow: totalBorrowsValue,
        kashiPairs: newKashiPairs,
      } = calculateService.calculateKashiPairPricesNew(kashiPairsData, pricesMap)

      const sortedKashiPairsBySupply = [...newKashiPairs].sort((a: KashiPairNew, b: KashiPairNew) =>
        BigNumber.from(a.totalAssetAmount)
          .add(BigNumber.from(a.totalBorrowAmount))
          .lte(BigNumber.from(b.totalAssetAmount).add(BigNumber.from(b.totalBorrowAmount)))
          ? 1
          : -1
      )

      const sortedKashiPairsByAsset = [...newKashiPairs].sort((a: KashiPairNew, b: KashiPairNew) =>
        BigNumber.from(a.totalAssetAmount).lte(BigNumber.from(b.totalAssetAmount)) ? 1 : -1
      )

      const sortedKashiPairsByBorrow = [...newKashiPairs].sort((a: KashiPairNew, b: KashiPairNew) =>
        BigNumber.from(a.totalBorrowAmount).lte(BigNumber.from(b.totalBorrowAmount)) ? 1 : -1
      )

      setCalculating(false)

      setTotalAssetsAmount(totalAssetsValue.toBigInt())
      setTotalBorrowsAmount(totalBorrowsValue.toBigInt())

      setTop3MarketsBySupply(
        sortedKashiPairsBySupply.slice(0, sortedKashiPairsBySupply.length < 3 ? sortedKashiPairsBySupply.length : 3)
      )
      setTop3MarketsByAsset(
        sortedKashiPairsByAsset.slice(0, sortedKashiPairsByAsset.length < 3 ? sortedKashiPairsByAsset.length : 3)
      )
      setTop3MarketsByBorrow(
        sortedKashiPairsByBorrow.slice(0, sortedKashiPairsByBorrow.length < 3 ? sortedKashiPairsByBorrow.length : 3)
      )

      setKashiPairs(newKashiPairs)
    }
  }

  useEffect(() => {}, [kashiPairs])

  useEffect(() => {
    if (!loadingKashiPairs && !calculating && !loadingKashiPairsDayData0 && !loadingKashiPairsDayData1) {
      const dataKashiPairsDayDataMap = [dataKashiPairsDayData0, dataKashiPairsDayData1]

      const dataKashiPairsDayData = dataKashiPairsDayDataMap.reduce(
        (prev: KashiPairDayData[], current?: { kashiPairDayDatas?: KashiPairDayData[] }) => [
          ...prev,
          ...(current && current.kashiPairDayDatas ? current.kashiPairDayDatas : []),
        ],
        []
      )
      const { kashiPairsMaps: kashiPairsMap } = calculateService.calculateKashiPairDayDataPrices(
        dataKashiPairsDayData,
        pricesMap
      )
      setKashiPairsDayData(kashiPairsMap)
    }
  }, [loadingKashiPairs, calculating, loadingKashiPairsDayData0, loadingKashiPairsDayData1])
  return (
    <>
      {/* <Charts data={kashiPairsDayData} loading={loadingDayData} /> */}
      <div className="container grid grid-cols-1 gap-4 mx-auto lg:grid-cols-3">
        <TotalCard
          containerClass="col-span-1"
          loading={loading}
          borrow="supply"
          data={{
            amount: totalAssetsAmount + totalBorrowsAmount,
            volumeIn24H: BigInt(0),
            topMarkets: top3MarketsBySupply,
          }}
        />
        <TotalCard
          containerClass="col-span-1"
          loading={loading}
          borrow="asset"
          data={{
            amount: totalAssetsAmount,
            volumeIn24H: BigInt(0),
            topMarkets: top3MarketsByAsset,
          }}
        />
        <TotalCard
          containerClass="col-span-1"
          loading={loading}
          borrow="borrow"
          data={{
            amount: totalBorrowsAmount,
            volumeIn24H: BigInt(0),
            topMarkets: top3MarketsByBorrow,
          }}
        />
      </div>
      <div className="container mx-auto mb-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="col-span-1">
            <TotalDayDataChart loading={loadingDayData} data={kashiPairsDayData} />
          </div>
          <div className="col-span-1">
            <TotalCompareChart loading={loadingDayData} data={kashiPairsDayData} />
          </div>
        </div>
      </div>
      <div className="container mx-auto mb-24">
        <PairMarketTable loading={loading || calculating} data={kashiPairs} />
      </div>
    </>
  )
}
export default KashiPairsView
