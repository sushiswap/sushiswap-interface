import React, { createContext, useCallback, useContext, useMemo } from 'react'
import { useTridentParentPageContext } from '../index'
import { Context } from './types'

export const TridentRemoveWeightedPoolContext = createContext<Context>({
  execute: () => null,
})

export const TridentRemoveWeightedPoolContextProvider = ({ children }) => {
  const parent = useTridentParentPageContext()

  const execute = useCallback(async () => {
    // Do some custom execution
    alert('Executing WeightedPool execute function')

    // Call parent execute to do some default execution stuff
    parent.execute()
  }, [parent])

  return (
    <TridentRemoveWeightedPoolContext.Provider value={useMemo(() => ({ execute }), [execute])}>
      {children}
    </TridentRemoveWeightedPoolContext.Provider>
  )
}

export const useTridentRemoveWeightedPoolPageContext = () => useContext(TridentRemoveWeightedPoolContext)
