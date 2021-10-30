import { poolAtom, poolBalanceAtom, totalSupplyAtom } from 'features/trident/context/atoms'
import Header from 'features/trident/pool/Header'
import HybridPoolComposition from 'features/trident/pool/hybrid/HybridPoolComposition'
import { useActiveWeb3React } from 'hooks'
import { useCurrency } from 'hooks/Tokens'
import { useTotalSupply } from 'hooks/useTotalSupply'
import { useTridentClassicPool } from 'hooks/useTridentClassicPools'
import TridentLayout, { TridentBody, TridentHeader } from 'layouts/Trident'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import { useTokenBalance } from 'state/wallet/hooks'

const Pool = () => {
  const { account, chainId } = useActiveWeb3React()
  const { query } = useRouter()

  const setPool = useSetRecoilState(poolAtom)
  const setTotalSupply = useSetRecoilState(totalSupplyAtom)
  const setPoolBalance = useSetRecoilState(poolBalanceAtom)

  const currencyA = useCurrency(query.tokens?.[0])
  const currencyB = useCurrency(query.tokens?.[1])
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
    <>
      <TridentHeader>
        <Header />
      </TridentHeader>
      <TridentBody>
        <HybridPoolComposition />
      </TridentBody>
    </>
  )
}

Pool.Provider = RecoilRoot
Pool.Layout = TridentLayout

export default Pool
