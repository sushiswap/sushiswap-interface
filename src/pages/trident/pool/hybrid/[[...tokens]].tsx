import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import TridentLayout from '../../../../layouts/Trident'
import HybridPoolComposition from '../../../../features/trident/pool/hybrid/HybridPoolComposition'
import Header from '../../../../features/trident/pool/Header'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import { useActiveWeb3React } from '../../../../hooks'
import { useRouter } from 'next/router'
import { poolAtom } from '../../../../features/trident/context/atoms'
import { poolBalanceAtom, totalSupplyAtom } from '../../../../features/trident/context/atoms'
import { useCurrency } from '../../../../hooks/Tokens'
import { NATIVE } from '@sushiswap/core-sdk'
import { SUSHI } from '../../../../config/tokens'
import { useTridentClassicPool } from '../../../../hooks/useTridentClassicPools'
import { useTotalSupply } from '../../../../hooks/useTotalSupply'
import { useTokenBalance } from '../../../../state/wallet/hooks'
import { useEffect } from 'react'
import PoolStatsChart from '../../../../features/trident/pool/PoolStatsChart'
import PoolStats from '../../../../features/trident/pool/PoolStats'
import Typography from '../../../../components/Typography'
import { useTridentHybridPool } from '../../../../hooks/useTridentHybridPools'

const Pool = () => {
  const { account, chainId } = useActiveWeb3React()
  const { query } = useRouter()
  const { i18n } = useLingui()

  const setPool = useSetRecoilState(poolAtom)
  const setTotalSupply = useSetRecoilState(totalSupplyAtom)
  const setPoolBalance = useSetRecoilState(poolBalanceAtom)

  const currencyA = useCurrency(query.tokens?.[0]) || NATIVE[chainId]
  const currencyB = useCurrency(query.tokens?.[1]) || SUSHI[chainId]
  const hybridPool = useTridentHybridPool(currencyA, currencyB, 30, true)
  const totalSupply = useTotalSupply(hybridPool ? hybridPool[1]?.liquidityToken : undefined)
  const poolBalance = useTokenBalance(account ?? undefined, hybridPool[1]?.liquidityToken)
  hybridPool
  useEffect(() => {
    if (!hybridPool[1]) return
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
    <div className="flex flex-col w-full mt-px mb-5">
      <Header />
      <HybridPoolComposition />
      {/* TODO: Jack - Might want to remove this typography from here */}
      <Typography variant="h3" weight={700} className="mx-5 mt-12 text-high-emphesis">
        {i18n._(t`Market Information`)}
      </Typography>
      <PoolStatsChart />
      <PoolStats />
    </div>
  )
}

Pool.Provider = RecoilRoot
Pool.Layout = TridentLayout

export default Pool
