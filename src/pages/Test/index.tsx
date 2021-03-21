import React from 'react'
import useKashi from '../../sushi-hooks/useKashi'
import useBentoBalances from '../../sushi-hooks/queries/useBentoBalances'
import { BigNumber } from '@ethersproject/bignumber'

import { useKashiPair } from 'kashi/context'
import Layout from 'pages/Kashi/components/Layout'
import styled from 'styled-components'

const Container = styled.div`
  height: 100%;
  width: 100%;
  max-width: 1280px;
`

const TestBed = () => {
  // const { kashiApproved, approve, approveAsset, approveCollateral, depositAddCollateral } = useKashi()
  // depositAddCollateral(
  //   { value: BigNumber.from(0).mul(BigNumber.from(10).pow(18)), decimals: 18 },
  //   '0xc2118d4d90b274016cB7a54c03EF52E6c537D957'
  // )
  //const { approveMaster } = useKashi()

  const kashiBalances = useKashiPair('0x5a0625c24ddd563e758958f189fc9e52abaa9023')
  console.log('kashiBalances:', kashiBalances)

  //approveMaster()

  //const summary = useBentoBalances()
  //console.log(summary)

  /*const bentoBoxContract = useBentoBoxContract(true) // withSigner
  console.log(await bentoBoxContract?.)*/
  return (
    <Container>
      <Layout />
    </Container>
  )
}

export default TestBed
