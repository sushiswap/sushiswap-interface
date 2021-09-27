import { ConstantProductPoolState, useTridentClassicPool } from '../../../../hooks/useTridentClassicPools'
import React, { useEffect } from 'react'
import { RecoilRoot, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  liquidityModeAtom,
  poolAtom,
  poolBalanceAtom,
  totalSupplyAtom,
} from '../../../../features/trident/context/atoms'

import Alert from '../../../../components/Alert'
import Button from '../../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import ClassicStandardMode from '../../../../features/trident/add/classic/ClassicStandardMode'
import ClassicZapMode from '../../../../features/trident/add/classic/ClassicZapMode'
import DepositSubmittedModal from '../../../../features/trident/DepositSubmittedModal'
import FixedRatioHeader from '../../../../features/trident/add/FixedRatioHeader'
import Link from 'next/link'
import { LiquidityMode } from '../../../../features/trident/types'
import ModeToggle from '../../../../features/trident/ModeToggle'
import SettingsTab from '../../../../components/Settings'
import TransactionReviewStandardModal from '../../../../features/trident/add/classic/TransactionReviewStandardModal'
import TransactionReviewZapModal from '../../../../features/trident/add/classic/TransactionReviewZapModal'
import TridentLayout from '../../../../layouts/Trident'
import Typography from '../../../../components/Typography'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../../../hooks'
import { useLingui } from '@lingui/react'
import { useTokenBalance } from '../../../../state/wallet/hooks'
import { useTotalSupply } from '../../../../hooks/useTotalSupply'
import useCurrenciesFromURL from '../../../../features/trident/context/hooks/useCurrenciesFromURL'
import { BREADCRUMBS } from '../../../../features/trident/Breadcrumb'
import Pool from '../../pool/classic/[[...tokens]]'

const AddClassic = () => {
  const { account, chainId } = useActiveWeb3React()
  const { i18n } = useLingui()

  const [[poolState, pool], setPool] = useRecoilState(poolAtom)
  const liquidityMode = useRecoilValue(liquidityModeAtom)
  const setTotalSupply = useSetRecoilState(totalSupplyAtom)
  const setPoolBalance = useSetRecoilState(poolBalanceAtom)

  const [[currencyA, currencyB]] = useCurrenciesFromURL()
  const classicPool = useTridentClassicPool(currencyA, currencyB, 30, true)

  const totalSupply = useTotalSupply(classicPool ? classicPool[1]?.liquidityToken : undefined)
  const poolBalance = useTokenBalance(account ?? undefined, classicPool[1]?.liquidityToken)

  useEffect(() => {
    setPool(classicPool)
  }, [chainId, classicPool, setPool])

  useEffect(() => {
    if (!totalSupply) return
    setTotalSupply(totalSupply)
  }, [setTotalSupply, totalSupply])

  useEffect(() => {
    if (!poolBalance) return
    setPoolBalance(poolBalance)
  }, [poolBalance, setPoolBalance])

  return (
    <div className="flex flex-col w-full mt-px mb-5">
      <div className="flex flex-col gap-4 p-5 bg-auto bg-dark-800 bg-bubble-pattern bg-opacity-60">
        <div className="flex flex-row justify-between">
          <Button
            color="blue"
            variant="outlined"
            size="sm"
            className="py-1 pl-2 rounded-full"
            startIcon={<ChevronLeftIcon width={24} height={24} />}
          >
            <Link href={`/trident/pool/classic/${pool?.token0}/${pool?.token1}`}>{i18n._(t`Back`)}</Link>
          </Button>
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

      <ModeToggle onChange={() => {}} />
      <FixedRatioHeader />

      {poolState === ConstantProductPoolState.NOT_EXISTS && (
        <div className="px-5 mb-3">
          <Alert
            dismissable={false}
            type="error"
            showIcon
            message={i18n._(t`A Pool could not be found for provided currencies`)}
          />
        </div>
      )}

      <>
        {liquidityMode === LiquidityMode.ZAP && (
          <>
            <ClassicZapMode />
            <TransactionReviewZapModal />
          </>
        )}
        {liquidityMode === LiquidityMode.STANDARD && (
          <>
            <ClassicStandardMode />
            <TransactionReviewStandardModal />
          </>
        )}
        <DepositSubmittedModal />
      </>
    </div>
  )
}

AddClassic.Provider = RecoilRoot
AddClassic.Layout = (props) => (
  <TridentLayout
    {...props}
    headerBg="bg-dots-pattern"
    headerHeight="h-[220px]"
    breadcrumbs={[BREADCRUMBS['pools'], BREADCRUMBS['pool_classic'], BREADCRUMBS['add_classic']]}
  />
)

export default AddClassic
