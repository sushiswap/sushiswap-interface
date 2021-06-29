import React, { FC, useState } from 'react'
import Head from 'next/head'
import Typography from '../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import Image from 'next/image'
import Container from '../../components/Container'
import { classNames } from '../../functions'

export enum InariSide {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
}

const Inari: FC = () => {
  const { i18n } = useLingui()
  const [side, setSide] = useState(InariSide.DEPOSIT)

  return (
    <>
      <Head>
        <title>Inari | Sushi</title>
        <meta name="description" content="Inari..." />
      </Head>
      <Container maxWidth="5xl" className="space-y-6">
        <div className="flex gap-6">
          <div className="flex flex-col min-w-[200px] items-center gap-4">
            <div>
              <Image src="/inari-sign.png" alt="inari-sign" width={140} height={105} />
            </div>

            <div className="border border-gradient-r-blue-pink-dark-900 px-5 py-2 rounded whitespace-nowrap w-full font-bold">
              SUSHI → Bento
            </div>
            <div className="border border-gradient-r-blue-pink-dark-900 px-5 py-2 rounded whitespace-nowrap w-full font-bold">
              SUSHI → Cream
            </div>
            <div className="border border-gradient-r-blue-pink-dark-900 px-5 py-2 rounded whitespace-nowrap w-full font-bold">
              Cream → Bento
            </div>
            <div className="border border-gradient-r-blue-pink-dark-900 px-5 py-2 rounded whitespace-nowrap w-full font-bold">
              SUSHI → Aave
            </div>
          </div>
          <div className="flex flex-grow flex-col">
            <Typography variant="h3" className="text-high-emphesis mb-2 font-medium">
              {i18n._(t`One-click strategies with INARI`)}
            </Typography>
            <Typography>
              {i18n._(t`Take your SUSHI and invest in various strategies with one click! Earn extra yields with BentoBox, use as
              collateral on other platforms, and more!`)}
            </Typography>
            <div className="bg-dark-900 border-dark-800 border-2 rounded p-4">
              <div className="grid grid-cols-2 rounded p-3px bg-dark-800 h-[48px]">
                <span
                  onClick={() => setSide(InariSide.DEPOSIT)}
                  className={classNames(
                    side === InariSide.DEPOSIT ? 'bg-gradient-to-r text-high-emphesis' : 'bg-dark-800 text-secondary',
                    'cursor-pointer flex items-center justify-center w-full font-bold border rounded border-dark-800 from-opaque-blue to-opaque-pink hover:from-blue hover:to-pink'
                  )}
                >
                  {i18n._(t`Deposit`)}
                </span>
                <span
                  onClick={() => setSide(InariSide.WITHDRAW)}
                  className={classNames(
                    side === InariSide.WITHDRAW ? 'bg-gradient-to-r text-high-emphesis' : 'bg-dark-800 text-secondary',
                    'cursor-pointer flex items-center justify-center w-full font-bold border rounded border-dark-800 from-opaque-blue to-opaque-pink hover:from-blue hover:to-pink'
                  )}
                >
                  {i18n._(t`Withdraw`)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col"></div>
        </div>
      </Container>
    </>
  )
}

export default Inari
