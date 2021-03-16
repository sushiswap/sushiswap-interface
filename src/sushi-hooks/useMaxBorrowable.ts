import { useState, useEffect } from 'react'
import { useKashiPairHelperContract } from './useContract'
import { useActiveWeb3React } from '../hooks'
import { ethers } from 'ethers'

const { BigNumber } = ethers

function useMaxBorrowable(pairAddress: string) {
  const kashiPairHelperContract = useKashiPairHelperContract()

  const { account } = useActiveWeb3React()

  const [max, setMax] = useState({
    safeMaxBorrowableLeft: 0,
    safeMaxBorrowableLeftPossible: 0
  })

  useEffect(() => {
    async function getMax() {
      const pairUserDetails = await kashiPairHelperContract?.pollPairs(account, [pairAddress])

      console.log({
        pairUserDetails,
        pairAddress,
        oracleExchangeRate: pairUserDetails[1][0].oracleExchangeRate,
        currentExchangeRate: pairUserDetails[1][0].currentExchangeRate
      })

      const maxBorrowableOracle = pairUserDetails[1][0].oracleExchangeRate.gt(BigNumber.from(0))
        ? pairUserDetails[1][0].userCollateralAmount
            .mul(BigNumber.from('1000000000000000000'))
            .div(BigNumber.from(100))
            .mul(BigNumber.from(75))
            .div(pairUserDetails[1][0].oracleExchangeRate)
        : BigNumber.from(0)

      const maxBorrowableStored = pairUserDetails[1][0].currentExchangeRate.gt(BigNumber.from(0))
        ? pairUserDetails[1][0].userCollateralAmount
            .mul(BigNumber.from('1000000000000000000'))
            .div(BigNumber.from(100))
            .mul(BigNumber.from(75))
            .div(pairUserDetails[1][0].currentExchangeRate)
        : BigNumber.from(0)

      console.log('max borrow', { maxBorrowableOracle, maxBorrowableStored })

      const maxBorrowable = maxBorrowableOracle.lt(maxBorrowableStored) ? maxBorrowableOracle : maxBorrowableStored

      console.log({ maxBorrowable })

      const safeMaxBorrowable = maxBorrowable.div(BigNumber.from(100)).mul(BigNumber.from(95))

      console.log({ safeMaxBorrowable })

      const safeMaxBorrowableLeft = safeMaxBorrowable.sub(pairUserDetails[1][0].userBorrowAmount)

      console.log({ safeMaxBorrowableLeft })

      const safeMaxBorrowableLeftPossible = pairUserDetails[1][0].totalBorrowAmount.lt(
        safeMaxBorrowable.sub(pairUserDetails[1][0].userBorrowAmount)
      )
        ? pairUserDetails[1][0].totalBorrowAmount
        : safeMaxBorrowable.sub(pairUserDetails[1][0].userBorrowAmount)

      console.log({ safeMaxBorrowableLeftPossible })

      setMax({ safeMaxBorrowableLeft, safeMaxBorrowableLeftPossible })
    }
    getMax()
  }, [account, pairAddress, kashiPairHelperContract])

  return max
}

export default useMaxBorrowable
