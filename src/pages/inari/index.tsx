import React, { FC } from 'react'
import Head from 'next/head'
import Typography from '../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import Image from 'next/image'

const Inari: FC = () => {
  const { i18n } = useLingui()
  return (
    <>
      <Head>
        <title>Inari | Sushi</title>
        <meta name="description" content="Inari..." />
      </Head>
      <div className="grid grid-cols-3">
        <div>
          <Image src="/inari-sign.png" alt="inari-sign" width="140px" height="105px" />
        </div>
        <div>
          <Typography variant="h3" className="text-high-emphesis mb-2 font-medium">
            {i18n._(t`One-click strategies with INARI`)}
          </Typography>
          <Typography>
            Take your SUSHI and invest in various strategies with one click! Earn extra yields with BentoBox, use as
            collateral on other platforms, and more!
          </Typography>
        </div>
        <div />
      </div>
    </>
  )
}

export default Inari
