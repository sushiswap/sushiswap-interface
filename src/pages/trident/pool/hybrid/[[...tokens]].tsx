import TridentLayout from '../../../../layouts/Trident'
import HybridPoolComposition from '../../../../features/trident/pool/hybrid/HybridPoolComposition'
import Header from '../../../../features/trident/pool/Header'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import { useActiveWeb3React } from '../../../../hooks'
import { useRouter } from 'next/router'
import { poolAtom } from '../../../../features/trident/pool/classic/context/atoms'
import { poolBalanceAtom, totalSupplyAtom } from '../../../../features/trident/context/atoms'
import { useCurrency } from '../../../../hooks/Tokens'
import { NATIVE } from '@sushiswap/core-sdk'
import { SUSHI } from '../../../../config/tokens'
import { useTridentClassicPool } from '../../../../hooks/useTridentClassicPools'
import { useTotalSupply } from '../../../../hooks/useTotalSupply'
import { useTokenBalance } from '../../../../state/wallet/hooks'
import { useEffect } from 'react'

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
      <HybridPoolComposition />
    </div>
  )
}

Pool.Provider = RecoilRoot
Pool.Layout = TridentLayout

export default Pool
