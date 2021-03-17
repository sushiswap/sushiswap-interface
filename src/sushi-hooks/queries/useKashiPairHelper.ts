import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { useBentoBoxContract, useKashiPairContract, useKashiPairHelperContract } from '../useContract'
//import { isAddressString, getContract } from '../../utils'

import useTransactionStatus from '../useTransactionStatus'
import getOracleName from './getOracleNames'
import getMainnetAddress from './getMainnetAddress'

import { isAddressString } from '../../utils'
import { BigNumber } from '@ethersproject/bignumber'
import Fraction from '../../constants/Fraction'
import _ from 'lodash'

import sushiData from '@sushiswap/sushi-data'

// import getOracleNames from './getOracleNames'

const useKashiSummary = (address: string) => {
  const { library, account } = useActiveWeb3React()

  const bentoBoxContract = useBentoBoxContract()
  const kashiPairContract = useKashiPairContract()
  const kashiPairHelperContract = useKashiPairHelperContract()

  const currentTransactionStatus = useTransactionStatus()

  const [summary, setSummary] = useState<any>()

  const fetchLendingPair = useCallback(async () => {
    const pairAddresses = [isAddressString(address)]
    //console.log('pairAddresses:', pairAddresses)

    const pairDetails = await kashiPairHelperContract?.getPairs(pairAddresses)
    //console.log('pairDetails:', pairDetails)

    //console.log('pairUserDetails_inputs:', account, pairAddresses)
    const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, pairAddresses)
    //console.log('pairUserDetails:', pairUserDetails)
    //console.log('details:', pairDetails[0].collateral)

    // Get SushiSwap Exchange pricing data for USD estimates
    const collateralSushiData = await sushiData.exchange.token({
      // eslint-disable-next-line @typescript-eslint/camelcase
      token_address: getMainnetAddress(pairDetails?.[0].collateral)
    })
    const assetSushiData = await sushiData.exchange.token({
      // eslint-disable-next-line @typescript-eslint/camelcase
      token_address: getMainnetAddress(pairDetails?.[0].asset)
    })
    const exchangeEthPrice = await sushiData.exchange.ethPrice()
    const collateralUSD = collateralSushiData?.derivedETH * exchangeEthPrice
    const assetUSD = assetSushiData?.derivedETH * exchangeEthPrice
    console.log('collateralUSD:', collateralUSD)
    console.log('assetUSD:', assetUSD)

    const allPairDetails = pairAddresses.map((address, i) => {
      const maxBorrowableOracle = pairUserDetails[1][i].oracleExchangeRate.gt(BigNumber.from(0))
        ? pairUserDetails[1][i].userCollateralAmount
            .mul(BigNumber.from('1000000000000000000'))
            .div(BigNumber.from(100))
            .mul(BigNumber.from(75))
            .div(pairUserDetails[1][0].oracleExchangeRate)
        : BigNumber.from(0)

      const maxBorrowableStored = pairUserDetails[1][i].currentExchangeRate.gt(BigNumber.from(0))
        ? pairUserDetails[1][i].userCollateralAmount
            .mul(BigNumber.from('1000000000000000000'))
            .div(BigNumber.from(100))
            .mul(BigNumber.from(75))
            .div(pairUserDetails[1][0].currentExchangeRate)
        : BigNumber.from(0)

      const maxBorrowable = maxBorrowableOracle.lt(maxBorrowableStored) ? maxBorrowableOracle : maxBorrowableStored

      const safeMaxBorrowable = maxBorrowable.div(BigNumber.from(100)).mul(BigNumber.from(95))

      const safeMaxBorrowableLeft = safeMaxBorrowable.sub(pairUserDetails[1][i].userBorrowAmount)

      const safeMaxBorrowableLeftPossible = pairUserDetails[1][i].totalBorrowAmount.lt(
        safeMaxBorrowable.sub(pairUserDetails[1][i].userBorrowAmount)
      )
        ? pairUserDetails[1][i].totalBorrowAmount
        : safeMaxBorrowable.sub(pairUserDetails[1][i].userBorrowAmount)

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
          total: {
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
            }
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
          health: {
            percentage: pairUserDetails[1][i].totalBorrowAmount
              ? Fraction.from(
                  BigNumber.from('1000000000000000000')
                    .mul(pairUserDetails[1][i].userBorrowAmount)
                    .div(maxBorrowable),
                  BigNumber.from(10).pow(18)
                ).toString()
              : BigNumber.from(0)
          },
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
            max: Fraction.from(
              safeMaxBorrowableLeftPossible,
              BigNumber.from(10).pow(pairDetails[i].assetDecimals)
            ).toString(),
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
      pairsCount: allPairDetails.length,
      userSuppliedPairCount: BigNumber.from(pairUserDetails[0].suppliedPairCount).toNumber(),
      userBorrowedPairCount: BigNumber.from(pairUserDetails[0].borrowPairCount).toNumber(),
      pair: allPairDetails,
      pairUserDetails
    }
    console.log('allDetails:', allDetails)

    setSummary(allDetails)
  }, [account, address, kashiPairHelperContract])

  useEffect(() => {
    if (account && library && bentoBoxContract && kashiPairContract && kashiPairHelperContract) {
      fetchLendingPair()
    }
  }, [
    account,
    bentoBoxContract,
    fetchLendingPair,
    kashiPairContract,
    currentTransactionStatus,
    kashiPairHelperContract,
    library
  ])

  return summary
}

export default useKashiSummary
