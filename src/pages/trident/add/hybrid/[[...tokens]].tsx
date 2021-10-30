import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE } from '@sushiswap/core-sdk'
import Button from 'components/Button'
import SettingsTab from 'components/Settings'
import Typography from 'components/Typography'
import { SUSHI } from 'config/tokens'
import HybridStandardMode from 'features/trident/add/hybrid/HybridStandardMode'
import HybridZapMode from 'features/trident/add/hybrid/HybridZapMode'
import { liquidityModeAtom, poolAtom, poolBalanceAtom, totalSupplyAtom } from 'features/trident/context/atoms'
import AddTransactionReviewModal from 'features/trident/create/old/CreateReviewModal'
import DepositSubmittedModal from 'features/trident/DepositSubmittedModal'
import ModeToggle from 'features/trident/ModeToggle'
import { LiquidityMode } from 'features/trident/types'
import { useActiveWeb3React } from 'hooks'
import { useCurrency } from 'hooks/Tokens'
import { useTotalSupply } from 'hooks/useTotalSupply'
import { useTridentHybridPool } from 'hooks/useTridentHybridPools'
import TridentLayout, { TridentBody, TridentHeader } from 'layouts/Trident'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { RecoilRoot, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { useTokenBalance } from 'state/wallet/hooks'

const AddHybrid = () => {
  const { account, chainId } = useActiveWeb3React()
  const { query } = useRouter()
  const { i18n } = useLingui()

  const [[, pool], setPool] = useRecoilState(poolAtom)
  const liquidityMode = useRecoilValue(liquidityModeAtom)
  const setTotalSupply = useSetRecoilState(totalSupplyAtom)
  const setPoolBalance = useSetRecoilState(poolBalanceAtom)

  const currencyA = useCurrency(query.tokens?.[0]) || NATIVE[chainId]
  const currencyB = useCurrency(query.tokens?.[1]) || SUSHI[chainId]
  const hybridPool = useTridentHybridPool(currencyA, currencyB, 50)
  const totalSupply = useTotalSupply(hybridPool ? hybridPool[1]?.liquidityToken : undefined)
  const poolBalance = useTokenBalance(account ?? undefined, hybridPool[1]?.liquidityToken)

  useEffect(() => {
    if (!hybridPool[1]) return
    // TODO ramin: remove
    setPool(hybridPool)
  }, [chainId, hybridPool, setPool])

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
      <TridentHeader>
        <div className="flex flex-row justify-between">
          <Button
            color="blue"
            variant="outlined"
            size="sm"
            className="py-1 pl-2 rounded-full"
            startIcon={<ChevronLeftIcon width={24} height={24} />}
          >
            {/*TODO ramin*/}
            <Link href={`/trident/pool/hybrid/${pool?.token0}/${pool?.token1}`}>{i18n._(t`Back`)}</Link>
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
      </TridentHeader>
      <TridentBody>
        {/*TODO ramin*/}
        <ModeToggle onChange={() => {}} />

        <div className="flex flex-col mt-6">
          {liquidityMode === LiquidityMode.ZAP && <HybridZapMode />}
          {liquidityMode === LiquidityMode.STANDARD && <HybridStandardMode />}
        </div>
      </TridentBody>

      {/*TODO*/}
      <AddTransactionReviewModal />
      <DepositSubmittedModal />
    </>
  )
}

AddHybrid.Provider = RecoilRoot
AddHybrid.Layout = TridentLayout

export default AddHybrid
