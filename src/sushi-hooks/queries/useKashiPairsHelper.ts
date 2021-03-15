import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { useBentoBoxContract, useKashiPairContract, useKashiPairHelperContract } from '../useContract'
//import { isAddressString, getContract } from '../../utils'
import Fraction from '../../constants/Fraction'

import getOracleName from './getOracleNames'
import { BigNumber } from '@ethersproject/bignumber'
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
    console.log("Kashi pair contract", kashiPairContract?.address)
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

    console.log({ account, pairs: ['0x2E082FBe03d87EFf58cC58b35b89b2539c9d868a']})

    const uni = await kashiPairHelperContract?.pollPairs(account, ['0x2E082FBe03d87EFf58cC58b35b89b2539c9d868a'])
    
    console.log('UNI', {
      uni,
      assetAPR: uni[1][0].assetAPR.toNumber(),
      borrowAPR: uni[1][0].borrowAPR.toString()
    })

    //const aprPrecision = await kashiPairHelperContract?.APY_PRECISION()
    //todo remove aprPrecision accounting for factor of 100
    const aprPrecision = BigNumber.from(1000000)

    //console.log('kashiPairHelperContract:', aprPrecision)
    //console.log('pairUserDetails:', pairUserDetails)

    //console.log('details:', pairUserDetails[0])

    const allPairDetails = pairAddresses?.map((address, i) => {
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
            collateral: pairUserDetails[1][i].totalCollateralAmount,
            asset: pairUserDetails[1][i].totalAssetAmount,
            borrow: pairUserDetails[1][i].totalBorrowAmount
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
          collateral: pairUserDetails[1][i].userCollateralAmount,
          asset: pairUserDetails[1][i].userAssetAmount,
          borrow: pairUserDetails[1][i].userBorrowAmount
        }
      }
    })

    console.log({ allPairDetails })

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
