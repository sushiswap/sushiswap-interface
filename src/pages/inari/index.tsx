import React from 'react'
import Head from 'next/head'
import Typography from '../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import Image from 'next/image'
import Container from '../../components/Container'
import DoubleGlowShadow from '../../components/DoubleGlowShadow'
import InariButton from '../../features/inari/Button'
import InariDescription from '../../features/inari/InariDescription'
import SideSwitch from '../../features/inari/SideSwitch'
import { ArrowRightIcon } from '@heroicons/react/outline'
import BalancePanel from '../../features/inari/BalancePanel'
import { useDerivedInariState, useInariState, useSelectedInariStrategy } from '../../state/inari/hooks'
import NetworkGuard from '../../guards/Network'
import { ChainId } from '@sushiswap/sdk'
import StrategyStepDisplay from '../../features/inari/StrategyStepDisplay'
import StrategySelector from '../../features/inari/StrategySelector'

const Inari = () => {
  const { i18n } = useLingui()
  const { inputValue, outputValue } = useInariState()
  const { tokens, general } = useDerivedInariState()
  const { balances } = useSelectedInariStrategy()

  return (
    <>
      <Head>
        <title>Inari | Sushi</title>
        <meta name="description" content="Inari..." />
      </Head>
      <Container maxWidth="5xl" className="space-y-6">
        <div className="flex gap-8 items-center">
          <div className="min-w-[140px] min-h-[105px]">
            <Image src="/inari-sign.png" alt="inari-sign" width={140} height={105} />
          </div>
          <div className="flex flex-col">
            <Typography variant="h3" className="text-high-emphesis mb-2" weight={700}>
              {i18n._(t`One-Click Strategies`)}
            </Typography>
            <Typography>
              {i18n._(t`Take your SUSHI and invest in various strategies with one click! Earn extra yields with BentoBox, use as
              collateral on other platforms, and more!`)}
            </Typography>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 sm:col-span-3">
            <div className="flex flex-col gap-5">
              <StrategySelector />
            </div>
          </div>
          <div className="col-span-12 sm:col-span-9 grid gap-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <StrategyStepDisplay />
              <SideSwitch />
            </div>
            <DoubleGlowShadow className="max-w-[100%]">
              <div className="bg-dark-900 border-dark-700 rounded border-2 p-5 grid gap-8">
                <div className="flex flex-col sm:flex-row items-center">
                  <div className="w-full sm:w-3/5 mr-2">
                    <BalancePanel
                      label={i18n._(t`From`)}
                      showMax
                      value={inputValue}
                      token={tokens?.inputToken}
                      symbol={general?.inputSymbol}
                      balance={balances?.inputTokenBalance}
                    />
                  </div>
                  <div className="flex items-center w-[60px] z-1 relative ml-[-16px] mr-[-16px]">
                    <div className="w-[60px] h-[60px] rounded-full sm:bg-dark-800 border-2 border-dark-900 p-2 flex items-center justify-center">
                      <ArrowRightIcon width={24} height={24} className="text-high-emphesis" />
                    </div>
                  </div>
                  <div className="w-full sm:w-2/5 ml-2">
                    <BalancePanel
                      label={i18n._(t`To`)}
                      value={outputValue}
                      token={tokens?.outputToken}
                      symbol={general?.outputSymbol}
                      balance={balances?.outputTokenBalance}
                    />
                  </div>
                </div>
                <InariButton color="gradient">Execute</InariButton>
                <div className="relative -m-5 p-7 mt-0 bg-dark-700 rounded-b">
                  <InariDescription />
                </div>
              </div>
            </DoubleGlowShadow>
          </div>
        </div>
      </Container>
    </>
  )
}

Inari.Guard = NetworkGuard([ChainId.MAINNET])

export default Inari
