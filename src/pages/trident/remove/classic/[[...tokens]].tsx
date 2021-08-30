import Button from '../../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import SettingsTab from '../../../../components/Settings'
import Typography from '../../../../components/Typography'
import { toHref } from '../../../../hooks/useTridentPools'
import React, { useEffect } from 'react'
import ClassicStandardMode from '../../../../features/trident/remove/classic/ClassicStandardMode'
import ModeToggle from '../../../../features/trident/ModeToggle'
import { LiquidityMode } from '../../../../features/trident/types'
import { RecoilRoot, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  currenciesAtom,
  liquidityModeAtom,
  poolBalanceAtom,
  totalSupplyAtom,
} from '../../../../features/trident/context/atoms'
import TridentLayout from '../../../../layouts/Trident'
import ClassicUnzapMode from '../../../../features/trident/remove/classic/ClassicUnzapMode'
import { useCurrency } from '../../../../hooks/Tokens'
import { useV2Pair } from '../../../../hooks/useV2Pairs'
import { useTotalSupply } from '../../../../hooks/useTotalSupply'
import { useTokenBalance } from '../../../../state/wallet/hooks'
import { useActiveWeb3React } from '../../../../hooks'
import { useRouter } from 'next/router'
import { poolAtom } from '../../../../features/trident/remove/classic/context/atoms'
import RemoveTransactionReviewModal from '../../../../features/trident/remove/classic/RemoveTransactionReviewModal'

const RemoveClassic = () => {
  const { account } = useActiveWeb3React()
  const { query } = useRouter()
  const { i18n } = useLingui()

  const [[, pool], setPool] = useRecoilState(poolAtom)
  const liquidityMode = useRecoilValue(liquidityModeAtom)
  const [currencies, setCurrencies] = useRecoilState(currenciesAtom)
  const setTotalSupply = useSetRecoilState(totalSupplyAtom)
  const setPoolBalance = useSetRecoilState(poolBalanceAtom)

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

  return (
    <div className="flex flex-col w-full mt-px mb-5">
      <div className="flex flex-col p-5 bg-dark-800 bg-auto bg-bars-pattern bg-opacity-60 gap-4">
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
          <SettingsTab />
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="h2" weight={700} className="text-high-emphesis">
            {i18n._(t`Remove Liquidity`)}
          </Typography>
          <Typography variant="sm">
            {i18n._(
              t`Receive both pool tokens directly with Standard mode, or receive total investment as any asset in Zap mode.`
            )}
          </Typography>
        </div>

        {/*spacer*/}
        <div className="h-2" />
      </div>

      {/*TODO*/}
      <ModeToggle onChange={() => {}} />

      <>
        {liquidityMode === LiquidityMode.ZAP && <ClassicUnzapMode />}
        {liquidityMode === LiquidityMode.STANDARD && <ClassicStandardMode />}
      </>

      <RemoveTransactionReviewModal />
    </div>
  )
}

RemoveClassic.Layout = TridentLayout
RemoveClassic.Provider = RecoilRoot

export default RemoveClassic
