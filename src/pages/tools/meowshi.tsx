import { MEOW, SUSHI, XSUSHI } from '../../constants'

import { ChainId } from '@sushiswap/sdk'
import Container from '../../components/Container'
import Head from 'next/head'
import Image from 'next/image'
import Typography from '../../components/Typography'
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
    <>
      <Head>
        <title>Meowshi | Sushi</title>
        <meta name="description" content="SushiSwap Meowshi..." />
      </Head>

      <Container className="text-center">
        <Typography component="h1" variant="h1" className="mb-4">
          Meowshi
        </Typography>
      </Container>
    </>
  )
}
