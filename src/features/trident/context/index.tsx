import React, { createContext, FC, useContext, useMemo } from 'react'
import { useTridentAddClassicContext } from '../add/classic/context'
import { useTridentAddWeightedContext } from '../add/weighted/context'
import { useTridentAddHybridContext } from '../add/hybrid/context'
import { useTridentAddConcentratedContext } from '../add/concentrated/context'
import { Pool, PoolContextType, PoolStateType, PoolType } from '../types'
import { useRouter } from 'next/router'
import { useTridentRemoveClassicContext } from '../remove/classic/context'
import { useTridentRemoveWeightedContext } from '../remove/weighted/context'
import { useTridentRemoveHybridContext } from '../remove/hybrid/context'
import { useTridentRemoveConcentratedContext } from '../remove/concentrated/context'

export const TridentFacadeContext = createContext(null)

const TridentAddFacadeProvider: FC<{ pool: Pool }> = ({ children, pool }) => {
  const { pathname } = useRouter()
  const addClassic = useTridentAddClassicContext()
  const addWeighted = useTridentAddWeightedContext()
  const addHybrid = useTridentAddHybridContext()
  const addConcentrated = useTridentAddConcentratedContext()

  const removeClassic = useTridentRemoveClassicContext()
  const removeWeighted = useTridentRemoveWeightedContext()
  const removeHybrid = useTridentRemoveHybridContext()
  const removeConcentrated = useTridentRemoveConcentratedContext()

  const context = useMemo(() => {
    return {
      add: {
        [PoolType.CLASSIC]: addClassic,
        [PoolType.WEIGHTED]: addWeighted,
        [PoolType.HYBRID]: addHybrid,
        [PoolType.CONCENTRATED]: addConcentrated,
      },
      remove: {
        [PoolType.CLASSIC]: removeClassic,
        [PoolType.WEIGHTED]: removeWeighted,
        [PoolType.HYBRID]: removeHybrid,
        [PoolType.CONCENTRATED]: removeConcentrated,
      },
    }[pathname.split('/')[2]][pool.type]
  }, [
    addClassic,
    addConcentrated,
    addHybrid,
    addWeighted,
    pathname,
    pool.type,
    removeClassic,
    removeConcentrated,
    removeHybrid,
    removeWeighted,
  ])

  return <TridentFacadeContext.Provider value={context}>{children}</TridentFacadeContext.Provider>
}

export default TridentAddFacadeProvider
export function useTridentContext<T extends PoolContextType>(): T {
  return useContext<T>(TridentFacadeContext)
}
export function useTridentState<T extends PoolStateType>(): T {
  return useContext(TridentFacadeContext).state
}
export function useTridentDispatch<T>() {
  useContext(TridentFacadeContext).dispatch
}
