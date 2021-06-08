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

import Head from 'next/head'
import Layout from '../layouts/DefaultLayout'
import useFarms from '../features/farm/useFarms'
import { useMasterChefContract } from '../hooks'

// import useUserInfo from '../features/farm/useUserInfo'

export default function Test() {
    // const masterChefContract = useMasterChefContract()
    // const res = useUserInfo(masterChefContract)

    // console.log({ res })

    const res1 = useOneDayBlock()
    const res2 = useAverageBlockTime()

    const res3 = useMasterChefV1Farms()
    const res4 = useMasterChefV2Farms()
    const res5 = useMiniChefFarms()

    const res6 = usePairs()

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
        <Layout>
            <Head>
                <title>Test | Sushi</title>
                <meta name="description" content="Test..." />
            </Head>
        </Layout>
    )
}
