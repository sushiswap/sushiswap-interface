import { useSetRecoilState } from 'recoil'
import { bentoboxRebasesAtom, currenciesAtom, poolAtom, poolBalanceAtom, totalSupplyAtom } from '../atoms'
import useCurrenciesFromURL from './useCurrenciesFromURL'
import { useTridentClassicPool } from '../../../../hooks/useTridentClassicPools'
import { useTotalSupply } from '../../../../hooks/useTotalSupply'
import { useTokenBalance } from '../../../../state/wallet/hooks'
import useBentoRebases from '../../../../hooks/useBentoRebases'
import { useEffect, useMemo } from 'react'
import { useActiveWeb3React } from '../../../../hooks'

const useInitClassicPoolState = () => {
  const { chainId, account } = useActiveWeb3React()
  const setPool = useSetRecoilState(poolAtom)
  const setTotalSupply = useSetRecoilState(totalSupplyAtom)
  const setPoolBalance = useSetRecoilState(poolBalanceAtom)
  const setCurrencies = useSetRecoilState(currenciesAtom)
  const setBentoboxRebases = useSetRecoilState(bentoboxRebasesAtom)

  const { currencies } = useCurrenciesFromURL()
  const classicPool = useTridentClassicPool(currencies?.[0], currencies?.[1], 30, true)
  const totalSupply = useTotalSupply(classicPool ? classicPool[1]?.liquidityToken : undefined)
  const poolBalance = useTokenBalance(account ?? undefined, classicPool[1]?.liquidityToken)
  const [rebases, rebasesLoading] = useBentoRebases(currencies)

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

  useEffect(() => {
    if (!currencies?.[0] || !currencies?.[1]) return
    setCurrencies([currencies?.[0], currencies?.[1]])
  }, [currencies, setCurrencies])

  useEffect(() => {
    if (
      rebasesLoading ||
      !currencies[0] ||
      !currencies[1] ||
      !rebases[currencies[0]?.wrapped.address] ||
      !rebases[currencies[1]?.wrapped.address]
    )
      return
    setBentoboxRebases(rebases)
  }, [currencies, rebases, rebasesLoading, setBentoboxRebases])

  return useMemo(
    () => classicPool && totalSupply && poolBalance && rebases,
    [classicPool, poolBalance, rebases, totalSupply]
  )
}

export default useInitClassicPoolState
