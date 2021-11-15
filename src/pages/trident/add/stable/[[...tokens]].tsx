import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE, SUSHI } from '@sushiswap/core-sdk'
import { useActiveWeb3React } from 'app/services/web3'
import Button from 'components/Button'
import SettingsTab from 'components/Settings'
import Typography from 'components/Typography'
import StableStandardMode from 'features/trident/add/stable/StableStandardMode'
import StableZapMode from 'features/trident/add/stable/StableZapMode'
import { liquidityModeAtom, poolAtom, poolBalanceAtom, totalSupplyAtom } from 'features/trident/context/atoms'
import DepositSubmittedModal from 'features/trident/DepositSubmittedModal'
import ModeToggle from 'features/trident/ModeToggle'
import { LiquidityMode } from 'features/trident/types'
import { useCurrency } from 'hooks/Tokens'
import { useTotalSupply } from 'hooks/useTotalSupply'
import { useTridentStablePool } from 'hooks/useTridentStablePools'
import TridentLayout, { TridentBody, TridentHeader } from 'layouts/Trident'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { RecoilRoot, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { useTokenBalance } from 'state/wallet/hooks'

const AddStable = () => {
  const { account, chainId } = useActiveWeb3React()
  const { query } = useRouter()
  const { i18n } = useLingui()

  const [[, pool], setPool] = useRecoilState(poolAtom)
  const liquidityMode = useRecoilValue(liquidityModeAtom)
  const setTotalSupply = useSetRecoilState(totalSupplyAtom)
  const setPoolBalance = useSetRecoilState(poolBalanceAtom)

  const currencyA = useCurrency(query.tokens?.[0]) || NATIVE[chainId]
  const currencyB = useCurrency(query.tokens?.[1]) || SUSHI[chainId]
  const stablePool = useTridentStablePool(currencyA, currencyB, 50)
  const totalSupply = useTotalSupply(stablePool ? stablePool[1]?.liquidityToken : undefined)
  const poolBalance = useTokenBalance(account ?? undefined, stablePool[1]?.liquidityToken)

  useEffect(() => {
    if (!stablePool[1]) return
    // TODO ramin: remove
    setPool(stablePool)
  }, [chainId, stablePool, setPool])

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
            <Link href={`/trident/pool/stable/${pool?.token0}/${pool?.token1}`}>{i18n._(t`Back`)}</Link>
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
          {liquidityMode === LiquidityMode.ZAP && <StableZapMode />}
          {liquidityMode === LiquidityMode.STANDARD && <StableStandardMode />}
        </div>
      </TridentBody>

      <DepositSubmittedModal />
    </>
  )
}

AddStable.Provider = RecoilRoot
AddStable.Layout = TridentLayout

export default AddStable
