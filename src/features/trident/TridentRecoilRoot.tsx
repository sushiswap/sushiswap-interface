import { FC } from 'react'
import { RecoilRoot } from 'recoil'
import { bentoboxRebasesAtom, currenciesAtom, poolAtom, poolBalanceAtom, totalSupplyAtom } from './context/atoms'
import useCurrenciesFromURL from './context/hooks/useCurrenciesFromURL'
import { ConstantProductPoolState, useTridentClassicPool } from '../../hooks/useTridentClassicPools'
import { useTotalSupply } from '../../hooks/useTotalSupply'
import { useTokenBalance } from '../../state/wallet/hooks'
import useBentoRebases from '../../hooks/useBentoRebases'
import { useActiveWeb3React } from '../../hooks'
import { PoolType } from '@sushiswap/tines'

const TridentClassicRecoilRoot: FC = (props) => {
  const { account } = useActiveWeb3React()
  const { currencies } = useCurrenciesFromURL()
  const classicPool = useTridentClassicPool(currencies?.[0], currencies?.[1], 30, true)
  const totalSupply = useTotalSupply(classicPool ? classicPool[1]?.liquidityToken : undefined)
  const poolBalance = useTokenBalance(account ?? undefined, classicPool[1]?.liquidityToken)
  const [rebases, rebasesLoading] = useBentoRebases(currencies)

  // Pool is loading
  if (classicPool[0] === ConstantProductPoolState.LOADING) return <></>

  // Render children if pool is not available somehow
  if (
    !classicPool[1] ||
    !totalSupply ||
    !poolBalance ||
    !currencies?.[0] ||
    !currencies?.[1] ||
    rebasesLoading ||
    !currencies[0] ||
    !currencies[1] ||
    !rebases[currencies[0]?.wrapped.address] ||
    !rebases[currencies[1]?.wrapped.address]
  )
    return <RecoilRoot>{props.children}</RecoilRoot>

  // Initialize state if pool is found
  return (
    <RecoilRoot
      initializeState={({ set }) => {
        set(poolAtom, classicPool)
        set(totalSupplyAtom, totalSupply)
        set(poolBalanceAtom, poolBalance)
        set(currenciesAtom, [currencies?.[0], currencies?.[1]])
        set(bentoboxRebasesAtom, rebases)
      }}
      {...props}
    />
  )
}

interface TridentRecoilRootProps {
  poolType: PoolType
}

const TridentRecoilRoot: FC<TridentRecoilRootProps> = ({ poolType, ...props }) => {
  if (poolType !== PoolType.ConstantProduct) throw new Error('PoolType does not exist')
  if (poolType === PoolType.ConstantProduct) return <TridentClassicRecoilRoot {...props} />
}

export default TridentRecoilRoot
