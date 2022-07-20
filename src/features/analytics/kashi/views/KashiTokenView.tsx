/* eslint-disable @next/next/no-img-element */
import { ChainId, Token as TokenSDK } from '@sushiswap/core-sdk'
import { CurrencyLogo, CurrencyLogoArray } from 'app/components/CurrencyLogo'
import { useKashiTokens } from 'app/features/kashi/hooks'
import { useKashiPricesSubgraphWithLoadingIndicator } from 'app/hooks/usePricesSubgraph'
import {
  useDataKashiTokensDayDataWithLoadingIndicator,
  useDataKashiTokenWithLoadingIndicator,
} from 'app/services/graph/hooks/kashipairs'
import { useActiveWeb3React } from 'app/services/web3'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import PairCollateralPieChart from '../components/PairCollateralPieChart'
import PairSupplyBorrowDayDataChart from '../components/PairSupplyBorrowDayDataChart'
import TokenCard from '../components/TokenCard'
import { useAppContext } from '../context/AppContext'
import { KashiPair } from '../types/KashiPair'
import { KashiPairDayDataMap, KashiPairDayDataMapsCollateral } from '../types/KashiPairDayData'
import { Token } from '../types/Token'

const KashiTokenView = () => {
  const [token, setToken] = useState<Token | undefined>()
  const [totalAsset, setTotalAsset] = useState<BigInt>(BigInt(0))
  const [totalBorrow, setTotalBorrow] = useState<BigInt>(BigInt(0))

  const [kashiPairs, setKashiPairs] = useState<KashiPair[]>([])
  const [kashiPairDayDataMaps, setKashiPairDayDataMaps] = useState<KashiPairDayDataMap[]>([])

  const [kashiPairDayDataMapsCollaterals, setKashiPairDayDataMapsCollaterals] = useState<
    KashiPairDayDataMapsCollateral[]
  >([])

  const { calculateService, tokenUtilService } = useAppContext()

  const router = useRouter()
  const { id } = router.query
  const { chainId } = useActiveWeb3React()
  const { loading: loadingDataToken, data: dataToken } = useDataKashiTokenWithLoadingIndicator({
    chainId,
    variables: { id },
  })

  const pairIds = kashiPairs.map((kashiPair) => kashiPair.id)

  const { loading: loadingKashiPairDayData, data: dataKashiPairDayData } =
    useDataKashiTokensDayDataWithLoadingIndicator({
      chainId,
      variables: { pairIds },
    })

  const tokens = useKashiTokens()
  const { loading: loadingPrice, data: pricesMap } = useKashiPricesSubgraphWithLoadingIndicator(Object.values(tokens))

  useEffect(() => {
    if (dataToken) {
      setTokenData()
    }
  }, [dataToken, loadingPrice])

  useEffect(() => {
    if (!loadingPrice) {
      const pricesMapKeys = Object.keys(pricesMap)
      if (pricesMapKeys.length > 0 && dataKashiPairDayData && dataKashiPairDayData.kashiPairDayDatas.length > 0) {
        const kashiPairDayDataMapsCollaterals = calculateService.calculateKashiPairDayDataPricesByCollateral(
          dataKashiPairDayData.kashiPairDayDatas,
          pricesMap
        )

        const { kashiPairsMaps } = calculateService.calculateKashiPairDayDataPrices(
          dataKashiPairDayData.kashiPairDayDatas,
          pricesMap
        )
        setKashiPairDayDataMapsCollaterals(kashiPairDayDataMapsCollaterals)
        setKashiPairDayDataMaps(kashiPairsMaps)
      }
    }
  }, [dataKashiPairDayData])

  const setTokenData = async () => {
    const { tokens, kashiPairs }: { tokens: Token[]; kashiPairs: KashiPair[] } = dataToken

    const { tokens: newTokens } = calculateService.calculateTokenPrices(tokens, pricesMap)

    const token = newTokens[0]
    setToken(token)

    const {
      kashiPairs: newKashiPairs,
      totalAsset,
      totalBorrow,
    } = calculateService.calculateKashiPairPrices(kashiPairs, pricesMap)

    setTotalAsset(totalAsset.toBigInt())
    setTotalBorrow(totalBorrow.toBigInt())
    setKashiPairs(newKashiPairs)
  }

  const token0 = new TokenSDK(
    ChainId.ETHEREUM,
    token?.id ?? '',
    Number(token?.decimals ?? 0),
    token?.symbol,
    token?.name
  )

  return (
    <>
      <div className="bg-black">
        <div className="container px-4 py-24 mx-auto">
          {!token ? (
            <div className="flex items-center col-span-2">
              <div>
                <div className="inline-block w-8 h-8 rounded-full aminate-pulse bg-dark-700"></div>
              </div>
              <div className="ml-2">
                <div>
                  <div className="inline-block w-40 h-8 rounded aminate-pulse bg-dark-700"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center col-span-2">
              <div>
                <CurrencyLogo currency={token0 ?? undefined} className="!rounded-full" size={30} />
              </div>
              <div className="ml-2">
                <h2 className="text-3xl font-medium text-white">{tokenUtilService.symbol(token?.symbol)}</h2>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="container mx-auto mb-16">
        <TokenCard data={token} totalAsset={totalAsset} totalBorrow={totalBorrow} containerClass="mb-4" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <PairCollateralPieChart title="Total Supply" type={'supply'} data={kashiPairs} />
          <PairCollateralPieChart title="Total Available" type={'asset'} data={kashiPairs} />
          <PairCollateralPieChart title="Total Borrow" type={'borrow'} data={kashiPairs} />
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
          <PairSupplyBorrowDayDataChart data={kashiPairDayDataMaps} type="supply" title="Total Supply" />
          <PairSupplyBorrowDayDataChart data={kashiPairDayDataMaps} type="borrow" title="Total Borrow" />
        </div>
        <div className="mt-4">
          {kashiPairDayDataMapsCollaterals
            ?.filter((value) => value.kashiPairsMaps.length > 0)
            .map((value) => {
              const { collateral, kashiPairsMaps } = value
              const token1 = new TokenSDK(
                ChainId.ETHEREUM,
                collateral?.id ?? '',
                Number(collateral?.decimals ?? 0),
                collateral?.symbol,
                collateral?.name
              )
              return (
                <div key={collateral.id} className="mt-8">
                  <div className="flex items-center col-span-2">
                    <div>
                      <CurrencyLogoArray currencies={[token0, token1]} dense />
                    </div>
                    <div className="ml-2">
                      <h3 className="text-xl font-medium">
                        {tokenUtilService.symbol(token?.symbol)}/{tokenUtilService.symbol(collateral?.symbol)}
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 mt-2 md:grid-cols-2">
                    <PairSupplyBorrowDayDataChart data={kashiPairsMaps} type="supply" title="Supply" />
                    <PairSupplyBorrowDayDataChart data={kashiPairsMaps} type="borrow" title="Borrow" />
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </>
  )
}

export default KashiTokenView
