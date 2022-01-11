import { PoolType } from '@sushiswap/tines'
import useBentoRebases from 'app/hooks/useBentoRebases'
import { useConstantProductPool } from 'app/hooks/useConstantProductPools'
import { useTotalSupply } from 'app/hooks/useTotalSupply'
import { useActiveWeb3React } from 'app/services/web3'
import { useTokenBalance } from 'app/state/wallet/hooks'
import React from 'react'
import { FC, useEffect } from 'react'
import { useRecoilCallback } from 'recoil'

import { bentoboxRebasesAtom, currenciesAtom, poolAtom, poolBalanceAtom, totalSupplyAtom } from './context/atoms'
import useCurrenciesFromURL from './context/hooks/useCurrenciesFromURL'

const TridentClassicRecoilRoot: FC = (props) => {
  const { account } = useActiveWeb3React()
  const { currencies, twap, fee } = useCurrenciesFromURL()
  const classicPool = useConstantProductPool(currencies?.[0], currencies?.[1], fee, twap)
  const totalSupply = useTotalSupply(classicPool ? classicPool.pool?.liquidityToken : undefined)
  const poolBalance = useTokenBalance(account ?? undefined, classicPool.pool?.liquidityToken)
  const { rebases } = useBentoRebases(currencies)

  const setState = useRecoilCallback(
    ({ set }) =>
      (classicPool, totalSupply, poolBalance, currencies, rebases) => {
        set(poolAtom, classicPool)
        set(totalSupplyAtom, totalSupply)
        set(poolBalanceAtom, poolBalance)
        set(currenciesAtom, currencies)
        set(bentoboxRebasesAtom, rebases)
      },
    []
  )

  useEffect(() => {
    if (
      classicPool.pool &&
      totalSupply &&
      poolBalance &&
      currencies[0]?.wrapped.address &&
      currencies[1]?.wrapped.address &&
      rebases[currencies[0]?.wrapped.address] &&
      rebases[currencies[1]?.wrapped.address]
    ) {
      setState(classicPool, totalSupply, poolBalance, currencies, rebases)
    }
  }, [classicPool, totalSupply, poolBalance, currencies, rebases, setState])

  // Render children if pool is loaded
  return <React.Fragment {...props} />
}

interface TridentRecoilRootProps {
  poolType: PoolType
}

const TridentRecoilRoot: FC<TridentRecoilRootProps> = ({ poolType, ...props }) => {
  if (poolType === PoolType.ConstantProduct) return <TridentClassicRecoilRoot {...props} />

  throw new Error('PoolType does not exist')
}

export default TridentRecoilRoot
