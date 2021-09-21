import TridentLayout from '../../../../layouts/Trident'
import PoolStats from '../../../../features/trident/pool/PoolStats'
import PoolStatsChart from '../../../../features/trident/pool/PoolStatsChart'
import MyDeposits from '../../../../features/trident/pool/MyDeposits'
import ClassicMarket from '../../../../features/trident/pool/classic/ClassicMarket'
import Header from '../../../../features/trident/pool/Header'
import ClassicMyRewards from '../../../../features/trident/pool/classic/ClassicMyRewards'
import Rewards from '../../../../features/trident/pool/Rewards'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import { useCurrency } from '../../../../hooks/Tokens'
import { NATIVE } from '@sushiswap/core-sdk'
import { SUSHI } from '../../../../config/tokens'
import { useTridentClassicPool } from '../../../../hooks/useTridentClassicPools'
import { useRouter } from 'next/router'
import { useActiveWeb3React } from '../../../../hooks'
import { poolBalanceAtom, totalSupplyAtom } from '../../../../features/trident/context/atoms'
import { useTotalSupply } from '../../../../hooks/useTotalSupply'
import { useTokenBalance } from '../../../../state/wallet/hooks'
import { useEffect } from 'react'
import { poolAtom } from '../../../../features/trident/pool/classic/context/atoms'
import { BarGraph } from '../../../../components/BarGraph'

const Pool = () => {
  const { account, chainId } = useActiveWeb3React()
  const { query } = useRouter()

  const setPool = useSetRecoilState(poolAtom)
  const setTotalSupply = useSetRecoilState(totalSupplyAtom)
  const setPoolBalance = useSetRecoilState(poolBalanceAtom)

  const currencyA = useCurrency(query.tokens?.[0]) || NATIVE[chainId]
  const currencyB = useCurrency(query.tokens?.[1]) || SUSHI[chainId]
  const classicPool = useTridentClassicPool(currencyA, currencyB, 30, true)
  const totalSupply = useTotalSupply(classicPool ? classicPool[1]?.liquidityToken : undefined)
  const poolBalance = useTokenBalance(account ?? undefined, classicPool[1]?.liquidityToken)

  useEffect(() => {
    if (!classicPool[1]) return
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
      <Header />
      <ClassicMarket />
      <PoolStatsChart />
      <PoolStats />
    </div>
  )
}

Pool.Provider = RecoilRoot
Pool.Layout = TridentLayout

export default Pool
