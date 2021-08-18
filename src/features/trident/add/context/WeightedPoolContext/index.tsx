import React, { createContext, useCallback, useContext, useMemo } from 'react'
import { useTridentAddParentPageContext } from '../index'
import { Context } from './types'

export const TridentAddWeightedPoolContext = createContext<Context>({
  execute: () => null,
})

export const TridentAddWeightedPoolContextProvider = ({ children }) => {
  const parent = useTridentAddParentPageContext()

  const execute = useCallback(async () => {
    // Do some custom execution
    alert('Executing WeightedPool execute function')

    // Call parent execute to do some default execution stuff
    parent.execute()
  }, [parent])

  return (
    <TridentAddWeightedPoolContext.Provider value={useMemo(() => ({ execute }), [execute])}>
      {children}
    </TridentAddWeightedPoolContext.Provider>
  )
}

export const useTridentAddWeightedPoolPageContext = () => useContext(TridentAddWeightedPoolContext)
