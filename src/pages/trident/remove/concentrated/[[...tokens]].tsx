import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent } from '@sushiswap/core-sdk'
import Button from 'components/Button'
import SettingsTab from 'components/Settings'
import Typography from 'components/Typography'
import { poolAtom, poolBalanceAtom, totalSupplyAtom } from 'features/trident/context/atoms'
import RemoveTransactionReviewStandardModal from 'features/trident/remove/classic/RemoveTransactionReviewStandardModal'
import { useCurrency } from 'hooks/Tokens'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useTotalSupply } from 'hooks/useTotalSupply'
import { useTridentClassicPool } from 'hooks/useTridentClassicPools'
import TridentLayout, { TridentBody, TridentHeader } from 'layouts/Trident'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { RecoilRoot, useRecoilState, useSetRecoilState } from 'recoil'
import { useTokenBalance } from 'state/wallet/hooks'

const DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

const RemoveConcentrated = () => {
  const { account } = useActiveWeb3React()
  const { query } = useRouter()
  const { i18n } = useLingui()

  const [[, pool], setPool] = useRecoilState(poolAtom)
  const setTotalSupply = useSetRecoilState(totalSupplyAtom)
  const setPoolBalance = useSetRecoilState(poolBalanceAtom)

  const currencyA = useCurrency(query.tokens?.[0])
  const currencyB = useCurrency(query.tokens?.[1])
  const classicPool = useTridentClassicPool(currencyA, currencyB, 50, true)
  const totalSupply = useTotalSupply(classicPool ? classicPool[1]?.liquidityToken : undefined)
  const poolBalance = useTokenBalance(account ?? undefined, classicPool[1]?.liquidityToken)

  useEffect(() => {
    if (!classicPool[1]) return
    setPool(classicPool)
  }, [classicPool, setPool])

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
      <TridentHeader pattern="bg-bars-pattern">
        <div className="flex flex-row justify-between">
          <Button
            color="blue"
            variant="outlined"
            size="sm"
            className="py-1 pl-2 rounded-full"
            startIcon={<ChevronLeftIcon width={24} height={24} />}
          >
            <Link href={`/trident/pool/concentrated/${pool?.token0}/${pool?.token1}`}>{i18n._(t`Back`)}</Link>
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

          {/*spacer*/}
          <div className="h-2" />
        </div>
      </TridentHeader>
      <TridentBody>
        {/*{liquidityMode === LiquidityMode.ZAP && <ConcentratedMode />}*/}

        <RemoveTransactionReviewStandardModal />
      </TridentBody>
    </>
  )
}

RemoveConcentrated.Provider = RecoilRoot
RemoveConcentrated.Layout = TridentLayout

export default RemoveConcentrated
