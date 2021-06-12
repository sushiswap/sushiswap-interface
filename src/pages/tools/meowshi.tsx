import { MEOW, SUSHI, XSUSHI } from '../../constants'

import { ChainId } from '@sushiswap/sdk'
import Head from 'next/head'
import Layout from '../../layouts/DefaultLayout'
import { useActiveWeb3React } from '../../hooks'
import { useLingui } from '@lingui/react'
import useMeowshi from '../../hooks/useMeowshi'
import { useTokenBalance } from '../../state/wallet/hooks'

export default function Meowshi() {
    const { i18n } = useLingui()
    const { account } = useActiveWeb3React()
    const sushiBalance = useTokenBalance(account, SUSHI[ChainId.MAINNET])
    const xSushiBalance = useTokenBalance(account, XSUSHI)
    const meowBalance = useTokenBalance(account, MEOW)

    const { allowance, meow, unmeow } = useMeowshi()

    console.log({ sushiBalance, xSushiBalance, meowBalance })

    return (
        <Layout>
            <Head>
                <title>Meowshi | Sushi</title>
                <meta name="description" content="SushiSwap Meowshi..." />
            </Head>
        </Layout>
    )
}
