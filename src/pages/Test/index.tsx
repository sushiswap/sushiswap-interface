import React from 'react'
import useKashi from '../../sushi-hooks/useKashi'
import useKashiPairsHelper from '../../sushi-hooks/queries/useKashiPairsHelper'
import useBentoBalances from '../../sushi-hooks/queries/useBentoBalances'
import { BigNumber } from '@ethersproject/bignumber'

const TestBed = () => {
  // const { kashiApproved, approve, approveAsset, approveCollateral, depositAddCollateral } = useKashi()
  // depositAddCollateral(
  //   { value: BigNumber.from(0).mul(BigNumber.from(10).pow(18)), decimals: 18 },
  //   '0xc2118d4d90b274016cB7a54c03EF52E6c537D957'
  // )
  //const summary = useKashiPairsHelper()
  //console.log(summary)

  const summary = useBentoBalances()
  console.log(summary)

  /*const bentoBoxContract = useBentoBoxContract(true) // withSigner
  console.log(await bentoBoxContract?.)*/
  return <></>
}

export default TestBed
