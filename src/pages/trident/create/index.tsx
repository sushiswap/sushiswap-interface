import TridentLayout from '../../../layouts/Trident'
import Typography from '../../../components/Typography'
import { t } from '@lingui/macro'
import Button from '../../../components/Button'
import { useLingui } from '@lingui/react'
import Link from 'next/link'
import { RecoilRoot, useRecoilState, useSetRecoilState } from 'recoil'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Stepper from '../../../components/Stepper'
import SelectPoolType from '../../../features/trident/create/SelectPoolType'
import CreateReviewModal from '../../../features/trident/create/CreateReviewModal'
import ClassicSetupPool from '../../../features/trident/create/classic/ClassicSetupPool'
import ClassicDepositAssets from '../../../features/trident/create/classic/ClassicDepositAssets'
import { useSetupPoolProperties } from '../../../features/trident/context/hooks/useSetupPoolProperties'
import HybridSetupPool from '../../../features/trident/create/hybrid/HybridSetupPool'
import {
  poolAtom,
  poolBalanceAtom,
  poolCreationPageAtom,
  totalSupplyAtom,
} from '../../../features/trident/context/atoms'
import { PoolType } from '../../../features/trident/types'
import PoolCreationSubmittedModal from '../../../features/trident/PoolCreationSubmittedModal'
import { ConstantProductPool, HybridPool } from '@sushiswap/trident-sdk'
import React, { useEffect } from 'react'
import { useIndependentAssetInputs } from '../../../features/trident/context/hooks/useIndependentAssetInputs'
import { CurrencyAmount, ZERO } from '@sushiswap/core-sdk'
import HybridStandardMode from '../../../features/trident/add/hybrid/HybridStandardMode'
import { HorizontalLine } from '../../../components/HorizontalLine'

const Pool = () => {
  const { i18n } = useLingui()
  const [page, setPage] = useRecoilState(poolCreationPageAtom)
  const [[, pool], setPool] = useRecoilState(poolAtom)
  const setTotalSupply = useSetRecoilState(totalSupplyAtom)
  const setPoolBalance = useSetRecoilState(poolBalanceAtom)
  const { parsedAmounts } = useIndependentAssetInputs()
  const {
    poolType: [poolType],
    feeTier: [feeTier],
  } = useSetupPoolProperties()

  useEffect(() => {
    if (parsedAmounts.length > 1 && parsedAmounts.every((el) => el)) {
      const pool =
        poolType === PoolType.ConstantProduct
          ? new ConstantProductPool(parsedAmounts[0].wrapped, parsedAmounts[1].wrapped, feeTier, true)
          : new HybridPool(parsedAmounts[0].wrapped, parsedAmounts[1].wrapped, feeTier)

      setPool([1, pool ? pool : null])
    }
  }, [feeTier, parsedAmounts, poolType, setPool])

  useEffect(() => {
    if (!pool) return
    setTotalSupply(CurrencyAmount.fromRawAmount(pool?.liquidityToken, ZERO))
  }, [pool, setTotalSupply])

  useEffect(() => {
    if (!pool) return
    setPoolBalance(CurrencyAmount.fromRawAmount(pool?.liquidityToken, ZERO))
  }, [pool, setPoolBalance])

  return (
    <div className="flex flex-col w-full mt-px mb-5">
      <div className="flex flex-col gap-4 p-5 pb-10">
        <div className="flex flex-row gap-2 justify-between">
          <div className="flex gap-4">
            <Typography variant="h2" weight={700} className="text-high-emphesis inline">
              {i18n._(t`Create New Liquidity Pool`)}
            </Typography>
            <Button
              color="blue"
              variant="outlined"
              size="xs"
              className="pl-2 pr-5 rounded-full inline"
              startIcon={<ChevronLeftIcon width={24} height={24} />}
            >
              <Link href={`/trident/pools`}>{i18n._(t`Pools`)}</Link>
            </Button>
          </div>
          <Typography variant="sm" className="flex items-center">
            {i18n._(t`Decide on a pool type, deposit assets, and create your pool on Sushi.`)}
          </Typography>
        </div>
      </div>

      <Stepper onChange={(index) => setPage(index)} value={page} className="flex flex-col">
        <HorizontalLine />
        <Stepper.List>
          <Stepper.Tab>Select Type</Stepper.Tab>
          <Stepper.Tab>Setup</Stepper.Tab>
          <Stepper.Tab>Deposit</Stepper.Tab>
        </Stepper.List>
        <HorizontalLine />
        <Stepper.Panels>
          <Stepper.Panel>
            <SelectPoolType />
          </Stepper.Panel>
          <Stepper.Panel>
            {poolType === PoolType.ConstantProduct && <ClassicSetupPool />}
            {poolType === PoolType.Hybrid && <HybridSetupPool />}
          </Stepper.Panel>
          <Stepper.Panel>
            {poolType === PoolType.ConstantProduct && <ClassicDepositAssets />}
            {poolType === PoolType.Hybrid && <HybridStandardMode />}
            {/*{selectedPoolType === PoolType.Weighted && <WeightedStandardMode />}*/}
            {/*{selectedPoolType === PoolType.ConcentratedLiquidity && <ConcentratedStandardMode />}*/}
          </Stepper.Panel>
        </Stepper.Panels>
      </Stepper>
      <CreateReviewModal />
      <PoolCreationSubmittedModal />
    </div>
  )
}

Pool.Provider = RecoilRoot
Pool.Layout = (props) => (
  <TridentLayout
    {...props}
    headerBg="bg-binary-pattern"
    headerHeight="h-[170px]"
    breadcrumbs={[
      { link: '/trident/pools', label: 'Pools' },
      { link: '/trident/create', label: 'Create Pool' },
    ]}
  />
)

export default Pool
