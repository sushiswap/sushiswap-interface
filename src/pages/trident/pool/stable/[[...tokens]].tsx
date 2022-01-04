import { poolAtom, poolBalanceAtom, totalSupplyAtom } from 'app/features/trident/context/atoms'
import Header from 'app/features/trident/pool/Header'
import StablePoolComposition from 'app/features/trident/pool/stable/StablePoolComposition'
import { useCurrency } from 'app/hooks/Tokens'
import { useConstantProductPool } from 'app/hooks/useConstantProductPools'
import { useTotalSupply } from 'app/hooks/useTotalSupply'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useActiveWeb3React } from 'app/services/web3'
import { useTokenBalance } from 'app/state/wallet/hooks'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { RecoilRoot, useSetRecoilState } from 'recoil'

const Pool = () => {
  const { account, chainId } = useActiveWeb3React()
  const { query } = useRouter()

  const setPool = useSetRecoilState(poolAtom)
  const setTotalSupply = useSetRecoilState(totalSupplyAtom)
  const setPoolBalance = useSetRecoilState(poolBalanceAtom)

  const currencyA = useCurrency(query.tokens?.[0])
  const currencyB = useCurrency(query.tokens?.[1])
  const classicPool = useConstantProductPool(currencyA, currencyB)
  const totalSupply = useTotalSupply(classicPool ? classicPool.pool?.liquidityToken : undefined)
  const poolBalance = useTokenBalance(account ?? undefined, classicPool.pool?.liquidityToken)

  useEffect(() => {
    if (!classicPool.pool) return
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
        <StablePoolComposition />
      </TridentBody>
    </>
  )
}

Pool.Provider = RecoilRoot
Pool.Layout = TridentLayout

export default Pool
