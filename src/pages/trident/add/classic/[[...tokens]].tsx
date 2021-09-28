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
import ClassicStandardAside from '../../../../features/trident/add/classic/ClassicStandardAside'
import ClassicZapAside from '../../../../features/trident/add/classic/ClassicZapAside'

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
    <>
      <div>
        <Button
          color="blue"
          variant="outlined"
          size="sm"
          className="py-1 pl-2 rounded-full"
          startIcon={<ChevronLeftIcon width={24} height={24} />}
        >
          <Link href={`/trident/pool/classic/${pool?.token0.address}/${pool?.token1.address}`}>
            {pool ? `${pool?.token0.symbol}-${pool?.token1.symbol}` : i18n._(t`Back`)}
          </Link>
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row w-full mt-px mb-5 gap-10 lg:justify-around">
        <div className="lg:w-7/12 flex flex-col gap-5">
          <div className="flex flex-col">
            <Typography variant="h2" weight={700} className="text-high-emphesis">
              {i18n._(t`Add Liquidity`)}
            </Typography>
            <Typography variant="sm">
              {i18n._(
                t`Deposit any or all pool tokens directly with Standard mode,  or invest with any asset in Zap mode.`
              )}
            </Typography>

            {/*spacer*/}
            <div className="h-8" />
          </div>

          <ModeToggle />
          <FixedRatioHeader />

          {poolState === ConstantProductPoolState.NOT_EXISTS && (
            <div className="mb-3">
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

        <div className="hidden lg:block lg:w-4/12 flex flex-col">
          {liquidityMode === LiquidityMode.STANDARD ? <ClassicStandardAside /> : <ClassicZapAside />}
        </div>
      </div>
    </>
  )
}

AddClassic.Provider = RecoilRoot
AddClassic.Layout = (props) => (
  <TridentLayout
    {...props}
    headerBg="bg-bubble-pattern"
    headerHeight="h-[194px]"
    breadcrumbs={[BREADCRUMBS['pools'], BREADCRUMBS['pool_classic'], BREADCRUMBS['add_classic']]}
  />
)

export default AddClassic
