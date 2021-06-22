import {
  useAverageBlockTime,
  useBundle,
  useMasterChefV1Farms,
  useMasterChefV2Farms,
  useMiniChefFarms,
  useOneDayBlock,
  usePairs,
  useSushiPrice,
} from '../services/graph'
// import useFarms from '../features/farm/useFarms'
import { useMasterChefContract, useMulticallContract } from '../hooks'

import Head from 'next/head'
import { useEffect } from 'react'

// import useUserInfo from '../features/farm/useUserInfo'

export default function Test() {
  const masterChefContract = useMulticallContract()
  useEffect(() => {
    ;(async function () {
      try {
        console.log(
          await masterChefContract.aggregate([
            ['0x0769fd68dFb93167989C6f7254cd0D766Fb2841F', '0x081e3eda'],
            // { "target": "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F", "callData": "0x081e3eda"}
          ])
        )
      } catch (error) {
        console.error(error)
      }
    })()
  })

  // const res = useUserInfo(masterChefContract)

  // console.log({ res })

  // const res1 = useOneDayBlock()
  // const res2 = useAverageBlockTime()

  // const res3 = useMasterChefV1Farms()
  // const res4 = useMasterChefV2Farms()
  // const res5 = useMiniChefFarms()

  // const res6 = usePairs()

  // console.log({ res1, res2, res3, res4, res5, res6 })
  // const farms = useFarms()
  // console.log({ farms })

  // const {
  //     data: { ethRate },
  // } = useBundle()

  // const {
  //     data: { bundles },
  // } = useBundle()

  // const res = useSushiPrice()

  // console.log({ res, res2 })

  return (
    <>
      <Head>
        <title>Test | Sushi</title>
        <meta name="description" content="Test..." />
      </Head>
    </>
  )
}
