import Button from '../../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import TridentLayout from '../../../../layouts/Trident'
import Typography from '../../../../components/Typography'
import { toHref } from '../../../../hooks/useTridentPools'
import ClassicStandardMode from '../../../../features/trident/add/classic/ClassicStandardMode'
import React, { useEffect } from 'react'
import SettingsTab from '../../../../components/Settings'
import DepositSettingsModal from '../../../../features/trident/add/classic/DepositSettingsModal'
import { LiquidityMode } from '../../../../features/trident/types'
import { atom, RecoilRoot, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { useRouter } from 'next/router'
import { useCurrency } from '../../../../hooks/Tokens'
import { ConstantProductPoolState, useTridentClassicPool } from '../../../../hooks/useTridentClassicPools'
import { ConstantProductPool, Currency, Fee } from '../../../../../../sushiswap-sdk'
import { useTotalSupply } from '../../../../hooks/useTotalSupply'
import {
  currenciesAtom,
  liquidityModeAtom,
  poolAtom,
  totalSupplyAtom,
} from '../../../../features/trident/add/classic/context/atoms'
import { useV2Pair } from '../../../../hooks/useV2Pairs'

const AddClassic = () => {
  const { query } = useRouter()
  const { i18n } = useLingui()

  const setPool = useSetRecoilState(poolAtom)
  const liquidityMode = useRecoilValue(liquidityModeAtom)
  const [currencies, setCurrencies] = useRecoilState(currenciesAtom)
  const setTotalSupply = useSetRecoilState(totalSupplyAtom)

  const currencyA = useCurrency(query.tokens[0])
  const currencyB = useCurrency(query.tokens[1])

  // TODO USE V2 FOR TESTING
  const classicPool = useV2Pair(currencyA, currencyB)

  const totalSupply = useTotalSupply(classicPool ? classicPool[1]?.liquidityToken : undefined)

  useEffect(() => {
    if (!classicPool[1]) return

    setPool(classicPool)
  }, [classicPool, setPool])

  useEffect(() => {
    setCurrencies([currencyA, currencyB])
  }, [currencyA, currencyB, setCurrencies])

  useEffect(() => {
    setTotalSupply(totalSupply)
  }, [setTotalSupply, totalSupply])

  return (
    <div className="flex flex-col w-full mt-px mb-5">
      <div className="flex flex-col p-5 bg-dark-800 bg-auto bg-bubble-pattern bg-opacity-60 gap-4">
        <div className="flex flex-row justify-between">
          <Button
            color="blue"
            variant="outlined"
            size="sm"
            className="rounded-full py-1 pl-2"
            startIcon={<ChevronLeftIcon width={24} height={24} />}
          >
            <Link href={`/trident/pool/${toHref('classic', currencies)}`}>{i18n._(t`Back`)}</Link>
          </Button>
          <DepositSettingsModal />
          {liquidityMode === LiquidityMode.ZAP && <SettingsTab />}
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="h2" weight={700} className="text-high-emphesis">
            {i18n._(t`Add Liquidity`)}
          </Typography>
          <Typography variant="sm">
            {i18n._(
              t`Deposit all pool tokens directly with Standard mode, or invest & rebalance with any asset in Zap mode.`
            )}
          </Typography>
        </div>

        {/*spacer*/}
        <div className="h-2" />
      </div>

      {/*<ModeToggle state={state} context={context} />*/}
      {/*<BalancedModeHeader />*/}

      {/*{state.liquidityMode === LiquidityMode.ZAP && <ClassicZapMode />}*/}
      {/*{state.liquidityMode === LiquidityMode.STANDARD && <ClassicStandardMode />}*/}
      {/**/}
      <ClassicStandardMode />
      {/*<AddTransactionReviewModal state={state} context={context} />*/}
      {/*<DepositSubmittedModal state={state} />*/}
    </div>
  )
}

AddClassic.Layout = TridentLayout
AddClassic.Provider = RecoilRoot

export default AddClassic
