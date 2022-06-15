/* eslint-disable @next/next/no-img-element */
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import PairCollateralPieChart from '../components/PairCollateralPieChart'
import PairSupplyBorrowDayDataChart from '../components/PairSupplyBorrowDayDataChart'
import TokenCard from '../components/TokenCard'
import { handleLogoError, useAppContext } from '../context/AppContext'
import { getKashiPairsDayDataQuery, getTokensQuery } from '../graphql/token'
import { KashiPair } from '../types/KashiPair'
import { KashiPairDayDataMap, KashiPairDayDataMapsCollateral } from '../types/KashiPairDayData'
import { Token } from '../types/Token'

const KashiTokenView = () => {
  const { tokenUtilService } = useAppContext()
  const [token, setToken] = useState<Token | undefined>()
  const [totalAsset, setTotalAsset] = useState<BigInt>(BigInt(0))
  const [totalBorrow, setTotalBorrow] = useState<BigInt>(BigInt(0))

  const [kashiPairs, setKashiPairs] = useState<KashiPair[]>([])
  const [kashiPairDayDataMaps, setKashiPairDayDataMaps] = useState<KashiPairDayDataMap[]>([])

  const [kashiPairDayDataMapsCollaterals, setKashiPairDayDataMapsCollaterals] = useState<
    KashiPairDayDataMapsCollateral[]
  >([])
  const [pricesMap, setPricesMap] = useState<{ [key: string]: BigInt }>({})
  const { calculateService, coinGeckoService } = useAppContext()

  const router = useRouter()
  const { id } = router.query
  const {
    loading: loadingDataToken,
    error,
    data: dataToken,
  } = useQuery(getTokensQuery, { variables: { id }, skip: !id })

  const pairIds = kashiPairs.map((kashiPair) => kashiPair.id)

  const { loading: loadingKashiPairDayData, data: dataKashiPairDayData } = useQuery(getKashiPairsDayDataQuery, {
    variables: { pairIds },
    skip: pairIds.length === 0,
  })

  useEffect(() => {
    if (dataToken) {
      setTokenData()
    }
  }, [dataToken])

  useEffect(() => {
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
  }, [pricesMap, dataKashiPairDayData])

  const setTokenData = async () => {
    const { tokens, kashiPairs }: { tokens: Token[]; kashiPairs: KashiPair[] } = dataToken
    const symbols = calculateService.extractKashiPairAssetSymbols(kashiPairs)
    const pricesMap = await coinGeckoService.getPrices(symbols)
    setPricesMap(pricesMap)

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
                <img
                  src={tokenUtilService.logo(token?.symbol)}
                  width="30px"
                  height="30px"
                  className="inline-block rounded-full"
                  onError={handleLogoError}
                  alt={token?.symbol}
                />
              </div>
              <div className="ml-2">
                <h2 className="text-3xl font-medium text-white">{tokenUtilService.symbol(token?.symbol)}</h2>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="container px-4 mx-auto mb-16 -mt-16">
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
              return (
                <div key={collateral.id} className="mt-8">
                  <div className="flex items-center col-span-2">
                    <div>
                      <img
                        src={tokenUtilService.logo(token?.symbol)}
                        width="25px"
                        height="25px"
                        className="inline-block rounded-full"
                        onError={handleLogoError}
                        alt={tokenUtilService.symbol(token?.symbol)}
                      />
                      <img
                        src={tokenUtilService.logo(collateral?.symbol)}
                        width="25px"
                        height="25px"
                        onError={handleLogoError}
                        className="inline-block -ml-2 rounded-full"
                        alt={collateral?.symbol}
                      />
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
