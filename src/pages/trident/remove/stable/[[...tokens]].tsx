import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'components/Button'
import SettingsTab from 'components/Settings'
import Typography from 'components/Typography'
import { poolAtom, poolBalanceAtom, totalSupplyAtom } from 'features/trident/context/atoms'
import ModeToggle from 'features/trident/ModeToggle'
import RemoveTransactionReviewStandardModal from 'features/trident/remove/classic/RemoveTransactionReviewStandardModal'
import { useCurrency } from 'hooks/Tokens'
import { useConstantProductPools } from 'hooks/useConstantProductPools'
import { useTotalSupply } from 'hooks/useTotalSupply'
import TridentLayout, { TridentBody, TridentHeader } from 'layouts/Trident'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { RecoilRoot, useRecoilState, useSetRecoilState } from 'recoil'
import { useActiveWeb3React } from 'services/web3'
import { useTokenBalance } from 'state/wallet/hooks'

const RemoveStable = () => {
  const { account } = useActiveWeb3React()
  const { query } = useRouter()
  const { i18n } = useLingui()

  const [{ pool }, setPool] = useRecoilState(poolAtom)
  const setTotalSupply = useSetRecoilState(totalSupplyAtom)
  const setPoolBalance = useSetRecoilState(poolBalanceAtom)

  const currencyA = useCurrency(query.tokens?.[0])
  const currencyB = useCurrency(query.tokens?.[1])
  const classicPool = useConstantProductPools(currencyA, currencyB)
  const totalSupply = useTotalSupply(classicPool ? classicPool.pool?.liquidityToken : undefined)
  const poolBalance = useTokenBalance(account ?? undefined, classicPool.pool?.liquidityToken)

  useEffect(() => {
    if (!classicPool.pool) return
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
            {/*TODO ramin*/}
            <Link href={`/trident/pool/stable/${pool?.token0}/${pool?.token1}`}>{i18n._(t`Back`)}</Link>
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
      </TridentHeader>

      <TridentBody>
        {/*TODO ramin*/}
        <ModeToggle onChange={() => {}} />

        <>
          {/*{liquidityMode === LiquidityMode.ZAP && <StableUnzapMode />}*/}
          {/*{liquidityMode === LiquidityMode.STANDARD && <StableStandardMode />}*/}
        </>

        <RemoveTransactionReviewStandardModal />
      </TridentBody>
    </>
  )
}

RemoveStable.Provider = RecoilRoot
RemoveStable.Layout = TridentLayout

export default RemoveStable
