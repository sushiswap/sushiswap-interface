import React, { createContext, FC, useContext, useMemo } from 'react'
import { useTridentAddClassicContext } from '../add/classic/context'
import { useTridentAddWeightedContext } from '../add/weighted/context'
import { useTridentAddHybridContext } from '../add/hybrid/context'
import { useTridentAddConcentratedContext } from '../add/concentrated/context'
import { Pool, PoolContextType, PoolStateType, PoolType } from '../types'

export const TridentFacadeContext = createContext(null)

const TridentFacadeProvider: FC<{ pool: Pool }> = ({ children, pool }) => {
  const classic = useTridentAddClassicContext()
  const weighted = useTridentAddWeightedContext()
  const hybrid = useTridentAddHybridContext()
  const concentrated = useTridentAddConcentratedContext()

  const context = useMemo(() => {
    return {
      [PoolType.CLASSIC]: classic,
      [PoolType.WEIGHTED]: weighted,
      [PoolType.HYBRID]: hybrid,
      [PoolType.CONCENTRATED]: concentrated,
    }[pool.type]
  }, [classic, concentrated, hybrid, pool.type, weighted])

  return <TridentFacadeContext.Provider value={context}>{children}</TridentFacadeContext.Provider>
}

export default TridentFacadeProvider
export function useTridentAddContext<T extends PoolContextType>(): T {
  return useContext<T>(TridentFacadeContext)
}
export function useTridentAddState<T extends PoolStateType>(): T {
  return useContext(TridentFacadeContext).state
}
export function useTridentDispatch<T>() {
  useContext(TridentFacadeContext).dispatch
}
