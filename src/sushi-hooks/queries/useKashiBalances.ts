import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { useKashiPairContract, useKashiPairHelperContract } from '../useContract'
import useTransactionStatus from '../useTransactionStatus'

import { isAddress } from '../../utils'
//import { BigNumber } from '@ethersproject/bignumber'
//import Fraction from '../../constants/Fraction'
//import sushiData from '@sushiswap/sushi-data'

const useKashiBalances = (pairAddress: string) => {
  const { library, account } = useActiveWeb3React()

  const kashiPairContract = useKashiPairContract()
  const kashiPairHelperContract = useKashiPairHelperContract()
  const pairAddressChecksum = isAddress(pairAddress)
  const currentTransactionStatus = useTransactionStatus()

  const [balances, setBalances] = useState<any>()
  const fetchLendingPair = useCallback(async () => {
    console.log('kashi_balances:', pairAddressChecksum, kashiPairHelperContract)
    const pairDetails = await kashiPairHelperContract?.getPairs([pairAddressChecksum])
    console.log('kashi_pairDetails:', pairDetails)
    const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddressChecksum])
    const i = 0 // since only dealing with array of length 1

    console.log(
      'kashi_balances_2:',
      pairAddressChecksum,
      pairUserDetails[1][i].userCollateralAmount,
      pairDetails[i].collateralDecimals
    )

    const balances = {
      collateral: {
        value: pairUserDetails[1][i].userCollateralAmount,
        decimals: pairDetails[i].collateralDecimals
      },
      asset: {
        value: pairUserDetails[1][i].userAssetAmount,
        decimals: pairDetails[i].assetDecimals
      },
      borrow: {
        value: pairUserDetails[1][i].userBorrowAmount,
        decimals: pairDetails[i].assetDecimals
      }
    }
    setBalances(balances)
  }, [account, kashiPairHelperContract, pairAddressChecksum])

  useEffect(() => {
    if (account && kashiPairContract && kashiPairHelperContract && pairAddressChecksum) {
      fetchLendingPair()
    }
  }, [
    account,
    fetchLendingPair,
    kashiPairContract,
    currentTransactionStatus,
    kashiPairHelperContract,
    library,
    pairAddressChecksum
  ])

  return balances
}

export default useKashiBalances
