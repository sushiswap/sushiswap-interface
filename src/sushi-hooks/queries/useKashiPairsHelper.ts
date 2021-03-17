import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { useBentoBoxContract, useKashiPairContract, useKashiPairHelperContract } from '../useContract'
//import { isAddressString, getContract } from '../../utils'
import Fraction from '../../constants/Fraction'

import getOracleName from './getOracleNames'
import getMainnetAddress from './getMainnetAddress'
import { BigNumber } from '@ethersproject/bignumber'

import sushiData from '@sushiswap/sushi-data'
import _ from 'lodash'
// import getOracleNames from './getOracleNames'

const useKashiSummary = () => {
  const { library, account } = useActiveWeb3React()

  const bentoBoxContract = useBentoBoxContract()
  const kashiPairContract = useKashiPairContract()
  const kashiPairHelperContract = useKashiPairHelperContract()

  const [summary, setSummary] = useState<any>()
  const fetchLendingPairs = useCallback(async () => {
    // todo: remove hardcode
    const filter = bentoBoxContract?.filters.LogDeploy(kashiPairContract?.address, null)
    // todo: remove assert
    const events = await bentoBoxContract?.queryFilter(filter!)

    // TODO: remove hardcode from testing
    const pairAddresses = events?.map(event => event.args?.[2])
    //const pairAddresses = ['0x6e9d0853e65f06fab1d5d7d4f78c49bf3595fcb4', '0x6e9d0853e65f06fab1d5d7d4f78c49bf3595fcb4']
    //console.log('pairAddresses:', pairAddresses)

    const pairDetails = await kashiPairHelperContract?.getPairs(pairAddresses)
    // console.log('pairDetails:', pairDetails)

    // console.log('pairUserDetails_inputs:', {
    //   account: account,
    //   pairs: pairAddresses,
    //   helper: kashiPairHelperContract?.address
    // })
    const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, pairAddresses)

    // Get tokens from pairs
    const tokensWithDuplicates: any[] = []
    pairDetails.map((pair: { collateral: string; asset: string }) => {
      tokensWithDuplicates.push(pair.collateral)
      tokensWithDuplicates.push(pair.asset)
    })
    const tokens = Array.from(new Set(tokensWithDuplicates))

    // Todo: experimental pricing data for each token
    const exchangeEthPrice = await sushiData.exchange.ethPrice()
    const tokensWithPricing = await Promise.all(
      tokens.map(async (address: string) => {
        try {
          const tokenExchangeDetails = await sushiData.exchange.token({
            // eslint-disable-next-line @typescript-eslint/camelcase
            token_address: getMainnetAddress(address)
          })
          return { address: address, price: tokenExchangeDetails?.derivedETH * exchangeEthPrice }
        } catch (e) {
          return null
        }
      })
    )

    const allPairDetails = pairAddresses?.map((address, i) => {
      const collateralUSD = Number(
        tokensWithPricing.find(token => token?.address === pairDetails[i].collateral)?.['price']
      )
      const assetUSD = Number(tokensWithPricing.find(token => token?.address === pairDetails[i].asset)?.['price'])

      console.log('pairPricing:', collateralUSD, assetUSD)
      return {
        address: address,
        oracle: {
          address: pairDetails[i].oracle,
          name: getOracleName(pairDetails[i].oracle),
          data: pairDetails[i].oracleData
        },
        collateral: {
          address: pairDetails[i].collateral,
          symbol: pairDetails[i].collateralSymbol,
          decimals: pairDetails[i].collateralDecimals
        },
        asset: {
          address: pairDetails[i].asset,
          symbol: pairDetails[i].assetSymbol,
          decimals: pairDetails[i].assetDecimals
        },
        details: {
          collateral: {
            value: pairUserDetails[1][i].totalCollateralAmount,
            string: Fraction.from(
              BigNumber.from(pairUserDetails[1][i].totalCollateralAmount),
              BigNumber.from(10).pow(pairDetails[i].collateralDecimals)
            ).toString(),
            usdString:
              Number(
                Fraction.from(
                  BigNumber.from(pairUserDetails[1][i].totalCollateralAmount),
                  BigNumber.from(10).pow(pairDetails[i].collateralDecimals)
                ).toString()
              ) * collateralUSD
          },
          asset: {
            value: pairUserDetails[1][i].totalAssetAmount,
            string: Fraction.from(
              BigNumber.from(pairUserDetails[1][i].totalAssetAmount),
              BigNumber.from(10).pow(pairDetails[i].assetDecimals)
            ).toString(),
            usdString:
              Number(
                Fraction.from(
                  BigNumber.from(pairUserDetails[1][i].totalAssetAmount),
                  BigNumber.from(10).pow(pairDetails[i].assetDecimals)
                ).toString()
              ) * assetUSD
          },
          borrow: {
            value: pairUserDetails[1][i].totalBorrowAmount,
            string: Fraction.from(
              BigNumber.from(pairUserDetails[1][i].totalBorrowAmount),
              BigNumber.from(10).pow(pairDetails[i].assetDecimals)
            ).toString(),
            usdString:
              Number(
                Fraction.from(
                  BigNumber.from(pairUserDetails[1][i].totalBorrowAmount),
                  BigNumber.from(10).pow(pairDetails[i].assetDecimals)
                ).toString()
              ) * assetUSD
          },
          rate: {
            current: pairUserDetails[1][i].currentExchangeRate,
            oracle: pairUserDetails[1][i].oracleExchangeRate
          },
          apr: {
            asset: pairUserDetails[1][i].assetAPR / 1e6,
            borrow: pairUserDetails[1][i].borrowAPR / 1e6
          },
          borrowInterestPerSecond: pairUserDetails[1][i].borrowAPR
        },
        user: {
          collateral: {
            value: pairUserDetails[1][i].userCollateralAmount,
            string: Fraction.from(
              BigNumber.from(pairUserDetails[1][i].userCollateralAmount),
              BigNumber.from(10).pow(pairDetails[i].collateralDecimals)
            ).toString(),
            usdString:
              Number(
                Fraction.from(
                  BigNumber.from(pairUserDetails[1][i].userCollateralAmount),
                  BigNumber.from(10).pow(pairDetails[i].collateralDecimals)
                ).toString()
              ) * collateralUSD
          },
          asset: {
            value: pairUserDetails[1][i].userAssetAmount,
            string: Fraction.from(
              BigNumber.from(pairUserDetails[1][i].userAssetAmount),
              BigNumber.from(10).pow(pairDetails[i].assetDecimals)
            ).toString(),
            usdString:
              Number(
                Fraction.from(
                  BigNumber.from(pairUserDetails[1][i].userAssetAmount),
                  BigNumber.from(10).pow(pairDetails[i].assetDecimals)
                ).toString()
              ) * assetUSD
          },
          borrow: {
            value: pairUserDetails[1][i].userBorrowAmount,
            string: Fraction.from(
              BigNumber.from(pairUserDetails[1][i].userBorrowAmount),
              BigNumber.from(10).pow(pairDetails[i].assetDecimals)
            ).toString(),
            usdString:
              Number(
                Fraction.from(
                  BigNumber.from(pairUserDetails[1][i].userBorrowAmount),
                  BigNumber.from(10).pow(pairDetails[i].assetDecimals)
                ).toString()
              ) * assetUSD
          }
        }
      }
    })

    const allDetails = {
      pairsCount: allPairDetails?.length,
      userSuppliedPairCount: BigNumber.from(pairUserDetails[0].suppliedPairCount).toNumber(),
      userBorrowedPairCount: BigNumber.from(pairUserDetails[0].borrowPairCount).toNumber(),
      pairs: allPairDetails
    }
    console.log('allDetails:', allDetails, pairUserDetails)

    setSummary(allDetails)
  }, [account, bentoBoxContract, kashiPairContract?.address, kashiPairHelperContract])

  useEffect(() => {
    if (account && library && bentoBoxContract && kashiPairContract && kashiPairHelperContract) {
      fetchLendingPairs()
    }
  }, [account, bentoBoxContract, fetchLendingPairs, kashiPairContract, kashiPairHelperContract, library])

  return summary
}

export default useKashiSummary
