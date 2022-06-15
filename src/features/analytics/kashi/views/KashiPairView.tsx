/* eslint-disable @next/next/no-img-element */
import { useQuery } from '@apollo/client'
import { i18n } from '@lingui/core'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import PairCard from '../components/PairCard'
import PairInterestPerSecondDayDataChart from '../components/PairInteresetPerSecondDayDataChart'
import PairSupplyAccruedInterestDayDataChart from '../components/PairSupplyAccruedInterestDayDataChart'
import PairSupplyBorrowDayDataChart from '../components/PairSupplyBorrowDayDataChart'
import PairSupplyBorrowMonthDataChart from '../components/PairSupplyBorrowMonthDataChart'
import PairUtilizationDayDataChart from '../components/PairUtilizationDayDataChart'
import { useAppContext } from '../context/AppContext'
import { getKashiPairQuery } from '../graphql/pair'
import { KashiPair } from '../types/KashiPair'
import { KashiPairDayData, KashiPairDayDataMap } from '../types/KashiPairDayData'

const KashiPairView = () => {
  const { tokenUtilService, handleLogoError } = useAppContext()
  const [kashiPair, setKashiPair] = useState<KashiPair | undefined>()
  const [kashiPairDayData, setKashiPairDayData] = useState<KashiPairDayDataMap[]>([])

  const [kashiPairDayDataMonthly, setKashiPairDayDataMonthly] = useState<KashiPairDayDataMap[]>([])

  const [pricesMap, setPricesMap] = useState<{ [key: string]: BigInt }>({})
  const { calculateService, coinGeckoService } = useAppContext()

  const router = useRouter()
  const { id } = router.query
  const {
    loading: loadingKashiPairs,
    error,
    data: dataKashiPairs,
  } = useQuery(getKashiPairQuery, { variables: { id }, skip: !id })

  useEffect(() => {
    if (dataKashiPairs) {
      setKashiPairData()
    }
  }, [dataKashiPairs])

  const setKashiPairData = async () => {
    const { kashiPairs, kashiPairDayDatas }: { kashiPairs: KashiPair[]; kashiPairDayDatas: KashiPairDayData[] } =
      dataKashiPairs
    const symbols = calculateService.extractKashiPairAssetSymbols(kashiPairs)
    const pricesMap = await coinGeckoService.getPrices(symbols)
    setPricesMap(pricesMap)

    const { kashiPairs: newKashiPairs } = calculateService.calculateKashiPairPrices(kashiPairs, pricesMap)

    const kashiPair = newKashiPairs[0]
    setKashiPair(kashiPair)

    const { kashiPairsMaps } = calculateService.calculateKashiPairDayDataPrices(kashiPairDayDatas, pricesMap)
    setKashiPairDayData(kashiPairsMaps)

    const { kashiPairsMaps: kashiPairsMapMonthly } = calculateService.calculateKashiPairDayDataPricesMonthly(
      kashiPairDayDatas,
      pricesMap
    )
    setKashiPairDayDataMonthly(kashiPairsMapMonthly)
  }

  return (
    <>
      <div className="bg-black">
        <div className="container mx-auto">
          {!kashiPair ? (
            <div className="flex items-center col-span-2">
              <div>
                <div className="inline-block w-8 h-8 rounded-full animate-pulse bg-dark-800"></div>
                <div className="inline-block w-8 h-8 -ml-2 rounded-full animate-pulse bg-dark-800"></div>
              </div>
              <div className="ml-2">
                <div>
                  <div className="inline-block w-40 h-8 rounded animate-pulse bg-dark-800"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center col-span-2">
              <div>
                <img
                  src={tokenUtilService.logo(kashiPair?.asset?.symbol)}
                  width="30px"
                  height="30px"
                  className="inline-block rounded-full"
                  onError={handleLogoError}
                  alt={tokenUtilService.symbol(kashiPair?.symbol)}
                />
                <img
                  src={tokenUtilService.logo(kashiPair?.collateral?.symbol)}
                  width="30px"
                  height="30px"
                  onError={handleLogoError}
                  className="inline-block -ml-2 rounded-full"
                  alt={kashiPair?.symbol}
                />
              </div>
              <div className="ml-2">
                <h2 className="text-3xl font-medium text-white">
                  {tokenUtilService.symbol(kashiPair?.asset?.symbol)}/
                  {tokenUtilService.symbol(kashiPair?.collateral?.symbol)}
                </h2>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="container mx-auto mb-16">
        <PairCard data={kashiPair} containerClass="mb-4" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <PairSupplyBorrowMonthDataChart
            containerClass="col-span-2"
            title={i18n._('Monthly Net Supply & Borrow')}
            data={kashiPairDayDataMonthly}
          />
          <PairSupplyBorrowDayDataChart type="supply" title={i18n._('Supply')} data={kashiPairDayData} />
          <PairSupplyBorrowDayDataChart type="borrow" title={i18n._('Borrow')} data={kashiPairDayData} />
          <PairInterestPerSecondDayDataChart data={kashiPairDayData} />
          <PairUtilizationDayDataChart data={kashiPairDayData} />
          <PairSupplyAccruedInterestDayDataChart data={kashiPairDayData} />
        </div>
      </div>
    </>
  )
}

export default KashiPairView
