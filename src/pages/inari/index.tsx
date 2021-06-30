import React, { FC, useState } from 'react'
import Head from 'next/head'
import Typography from '../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import Image from 'next/image'
import Container from '../../components/Container'
import DoubleGlowShadow from '../../components/DoubleGlowShadow'
import { ArrowDownIcon } from '@heroicons/react/solid'
import { SUSHI } from '../../constants'
import InariButton from '../../features/inari/Button'
import InputBalancePanel from '../../features/inari/InputBalancePanel'
import OutputPanel from '../../features/inari/OutputPanel'
import InariHeader from '../../features/inari/InariHeader'
import StrategyStepDisplay from '../../features/inari/StrategyStepDisplay'
import SideSwitch from '../../features/inari/SideSwitch'
import StrategySelector from '../../features/inari/StrategySelector'
import useInari from '../../hooks/useInari'

export interface InaryStrategy {
  name: string
  steps: string[]
  description: string
  outputCurrency: string
}

const strategies: InaryStrategy[] = [
  {
    name: 'SUSHI → BentoBox',
    steps: ['SUSHI', 'xSUSHI', 'BentoBox'],
    description: t`Stake SUSHI for xSUSHI and deposit into BentoBox in one click. xSUSHI in BentoBox is automatically
                invested into a passive yield strategy, and can be lent or used as collateral for borrowing in Kashi.`,
    outputCurrency: t`xSUSHI in Bento`,
  },
  {
    name: 'SUSHI → Cream',
    steps: ['SUSHI', 'xSUSHI', 'Cream'],
    description: t`TODO`,
    outputCurrency: t`xSUSHI in Cream`,
  },
  {
    name: 'CreamSUSHI → BentoBox',
    steps: ['Cream', 'BentoBox'],
    description: t`TODO`,
    outputCurrency: t`TODO`,
  },
  {
    name: 'SUSHI → Aave',
    steps: ['SUSHI', 'xSUSHI', 'Aave'],
    description: t`TODO`,
    outputCurrency: t`xSUSHI in Aave`,
  },
]

const Inari: FC = () => {
  const { i18n } = useLingui()
  const [withdraw, setWithdraw] = useState(true)
  const [strategy, setStrategy] = useState(0)
  const [value, setValue] = useState('')

  const { inari } = useInari()

  const execute = () => {
    inari()
  }

  return (
    <>
      <Head>
        <title>Inari | Sushi</title>
        <meta name="description" content="Inari..." />
      </Head>
      <Container maxWidth="5xl" className="space-y-6">
        <div className="grid grid-cols-9 gap-10">
          <div className="col-span-3">
            <div className="flex flex-col gap-5">
              <div className="flex gap-8 items-center">
                <div className="min-w-[84px] min-h-[64px]">
                  <Image src="/inari-sign.png" alt="inari-sign" width={84} height={64} />
                </div>
                <Typography variant="h1" className="text-high-emphesis mb-2" weight={700}>
                  {i18n._(t`One-Click Strategies`)}
                </Typography>
              </div>
              <Typography>
                {i18n._(t`Take your SUSHI and invest in various strategies with one click! Earn extra yields with BentoBox, use as
              collateral on other platforms, and more!`)}
              </Typography>
              <StrategySelector strategies={strategies} strategy={strategy} setStrategy={setStrategy} />
            </div>
          </div>
          <div className="col-span-6">
            <DoubleGlowShadow>
              <div className="bg-dark-800 border-dark-700 border-2 rounded p-7 grid gap-4">
                <InariHeader strategy={strategies[strategy]} />
                <div className="bg-dark-900 border-dark-700 rounded border-2 m-[-30px] mt-0 p-5 grid gap-4">
                  <div className="flex justify-between items-center">
                    <StrategyStepDisplay strategy={strategies[strategy]} />
                    <SideSwitch withdraw={withdraw} setWithdraw={setWithdraw} />
                  </div>
                  <div className="grid gap-2">
                    <InputBalancePanel value={value} onUserInput={setValue} />
                    <div className="ml-6 flex relative mt-[-24px] mb-[-24px]">
                      <div className="w-12 h-12 rounded-full bg-dark-800 border-2 border-dark-900 p-2 flex items-center justify-center">
                        <ArrowDownIcon width={24} height={24} />
                      </div>
                    </div>
                    <OutputPanel label={t`xSUSHI in BentoBox`} />
                  </div>
                  <InariButton color="gradient" onClick={execute}>
                    Execute
                  </InariButton>
                </div>
              </div>
            </DoubleGlowShadow>
          </div>
        </div>
      </Container>
    </>
  )
}

export default Inari
