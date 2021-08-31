import Button from '../../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import TridentLayout from '../../../../layouts/Trident'
import Typography from '../../../../components/Typography'
import { toHref } from '../../../../hooks/useTridentPools'
import ClassicStandardMode from '../../../../features/trident/add/classic/ClassicStandardMode'
import React, { useCallback, useEffect } from 'react'
import SettingsTab from '../../../../components/Settings'
import DepositSettingsModal from '../../../../features/trident/add/classic/DepositSettingsModal'
import { LiquidityMode } from '../../../../features/trident/types'
import {
  RecoilRoot,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil'
import { useRouter } from 'next/router'
import { useCurrency } from '../../../../hooks/Tokens'
import { useTotalSupply } from '../../../../hooks/useTotalSupply'
import {
  mainInputAtom,
  poolAtom,
  secondaryInputSelector,
  zapInputAtom,
} from '../../../../features/trident/add/classic/context/atoms'
import { useV2Pair } from '../../../../hooks/useV2Pairs'
import { useTokenBalance } from '../../../../state/wallet/hooks'
import { useActiveWeb3React } from '../../../../hooks'
import AddTransactionReviewModal from '../../../../features/trident/add/classic/AddTransactionReviewModal'
import ModeToggle from '../../../../features/trident/ModeToggle'
import ClassicZapMode from '../../../../features/trident/add/classic/ClassicZapMode'
import {
  currenciesAtom,
  liquidityModeAtom,
  poolBalanceAtom,
  totalSupplyAtom,
} from '../../../../features/trident/context/atoms'
import FixedRatioHeader from '../../../../features/trident/add/FixedRatioHeader'

const AddClassic = () => {
  const { account } = useActiveWeb3React()
  const { query } = useRouter()
  const { i18n } = useLingui()

  const [[, pool], setPool] = useRecoilState(poolAtom)
  const liquidityMode = useRecoilValue(liquidityModeAtom)
  const [currencies, setCurrencies] = useRecoilState(currenciesAtom)
  const setTotalSupply = useSetRecoilState(totalSupplyAtom)
  const setPoolBalance = useSetRecoilState(poolBalanceAtom)

  // TODO USE V2 FOR TESTING
  const currencyA = useCurrency(query.tokens[0])
  const currencyB = useCurrency(query.tokens[1])
  const classicPool = useV2Pair(currencyA, currencyB)
  const totalSupply = useTotalSupply(classicPool ? classicPool[1]?.liquidityToken : undefined)
  const poolBalance = useTokenBalance(account ?? undefined, pool?.liquidityToken)

  useEffect(() => {
    if (!classicPool[1]) return
    setPool(classicPool)
  }, [classicPool, setPool])

  useEffect(() => {
    if (!currencyA || !currencyB) return
    setCurrencies([currencyA, currencyB])
  }, [currencyA, currencyB, setCurrencies])

  useEffect(() => {
    if (!totalSupply) return
    setTotalSupply(totalSupply)
  }, [setTotalSupply, totalSupply])

  useEffect(() => {
    if (!poolBalance) return
    setPoolBalance(poolBalance)
  }, [poolBalance, setPoolBalance])

  const handleLiquidityModeChange = useRecoilCallback(
    ({ reset }) =>
      async () => {
        reset(mainInputAtom)
        reset(secondaryInputSelector)
        reset(zapInputAtom)
      },
    []
  )

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

      <ModeToggle onChange={handleLiquidityModeChange} />
      <FixedRatioHeader />

      {liquidityMode === LiquidityMode.ZAP && <ClassicZapMode />}
      {liquidityMode === LiquidityMode.STANDARD && <ClassicStandardMode />}

      <AddTransactionReviewModal />
      {/*<DepositSubmittedModal state={state} />*/}
    </div>
  )
}

AddClassic.Layout = TridentLayout
AddClassic.Provider = RecoilRoot

export default AddClassic
