import { useConstantProductPool } from 'app/hooks/useConstantProductPools'
import { poolAtom, poolBalanceAtom, totalSupplyAtom } from 'features/trident/context/atoms'
import Header from 'features/trident/pool/Header'
import StablePoolComposition from 'features/trident/pool/stable/StablePoolComposition'
import { useCurrency } from 'hooks/Tokens'
import { useTotalSupply } from 'hooks/useTotalSupply'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import { useActiveWeb3React } from 'services/web3'
import { useTokenBalance } from 'state/wallet/hooks'

import TridentLayout, { TridentBody, TridentHeader } from '../../../../layouts/Trident'

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
