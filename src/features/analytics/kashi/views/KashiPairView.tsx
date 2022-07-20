/* eslint-disable @next/next/no-img-element */
import { i18n } from '@lingui/core'
import { ChainId, Token } from '@sushiswap/core-sdk'
import { CurrencyLogoArray } from 'app/components/CurrencyLogo'
import { useKashiTokens } from 'app/features/kashi/hooks'
import { useKashiPricesSubgraphWithLoadingIndicator } from 'app/hooks/usePricesSubgraph'
import { useDataKashiPairWithLoadingIndicator } from 'app/services/graph/hooks/kashipairs'
import { useActiveWeb3React } from 'app/services/web3'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import PairCard from '../components/PairCard'
import PairInterestPerSecondDayDataChart from '../components/PairInteresetPerSecondDayDataChart'
import PairSupplyAccruedInterestDayDataChart from '../components/PairSupplyAccruedInterestDayDataChart'
import PairSupplyBorrowDayDataChart from '../components/PairSupplyBorrowDayDataChart'
import PairSupplyBorrowMonthDataChart from '../components/PairSupplyBorrowMonthDataChart'
import PairUtilizationDayDataChart from '../components/PairUtilizationDayDataChart'
import { useAppContext } from '../context/AppContext'
import { KashiPair } from '../types/KashiPair'
import { KashiPairDayData, KashiPairDayDataMap } from '../types/KashiPairDayData'
const KashiPairView = () => {
  const { tokenUtilService, calculateService, handleLogoError } = useAppContext()
  const [kashiPair, setKashiPair] = useState<KashiPair | undefined>()
  const [kashiPairDayData, setKashiPairDayData] = useState<KashiPairDayDataMap[]>([])

  const [kashiPairDayDataMonthly, setKashiPairDayDataMonthly] = useState<KashiPairDayDataMap[]>([])

  const router = useRouter()
  const { id } = router.query

  const { chainId } = useActiveWeb3React()
  const { loading: loadingKashiPairs, data: dataKashiPairs } = useDataKashiPairWithLoadingIndicator({
    chainId,
    variables: { id },
  })

  const tokens = useKashiTokens()
  const { loading: loadingPrice, data: pricesMap } = useKashiPricesSubgraphWithLoadingIndicator(Object.values(tokens))

  useEffect(() => {
    if (dataKashiPairs) {
      setKashiPairData()
    }
  }, [dataKashiPairs, loadingPrice])

  const setKashiPairData = async () => {
    if (!loadingPrice) {
      const { kashiPairs, kashiPairDayDatas }: { kashiPairs: KashiPair[]; kashiPairDayDatas: KashiPairDayData[] } =
        dataKashiPairs

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
  }

  // let asset = undefined
  // let collateral = undefined
  const kashiAsset = kashiPair?.asset
  const kashiCollateral = kashiPair?.collateral
  // if (kashiAsset !== undefined && kashiCollateral !== undefined && chainId !== undefined) {
  const asset = new Token(
    chainId ?? ChainId.ETHEREUM,
    kashiAsset?.id ?? '',
    Number(kashiAsset?.decimals ?? 0),
    kashiAsset?.symbol,
    kashiAsset?.name
  )
  const collateral = new Token(
    chainId ?? ChainId.ETHEREUM,
    kashiCollateral?.id ?? '',
    Number(kashiCollateral?.decimals ?? 0),
    kashiCollateral?.symbol,
    kashiCollateral?.name
  )
  // }
  return (
    <>
      <div className="bg-black">
        <div className="container mx-auto">
          {!kashiPair && asset !== undefined && collateral !== undefined ? (
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
                <CurrencyLogoArray currencies={[asset, collateral]} dense />
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
