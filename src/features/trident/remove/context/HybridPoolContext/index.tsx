import React, { createContext, useCallback, useContext, useMemo } from 'react'
import { useTridentParentPageContext } from '../index'
import { Context } from './types'

export const TridentRemoveHybridPoolContext = createContext<Context>({
  execute: () => null,
})

export const TridentRemoveHybridPoolContextProvider = ({ children }) => {
  const parent = useTridentParentPageContext()

  const execute = useCallback(async () => {
    // Do some custom execution
    alert('Executing HybridPool execute function')

    // Call parent execute to do some default execution stuff
    parent.execute()
  }, [parent])

  return (
    <TridentRemoveHybridPoolContext.Provider value={useMemo(() => ({ execute }), [execute])}>
      {children}
    </TridentRemoveHybridPoolContext.Provider>
  )
}

export const useTridentRemoveHybridPoolPageContext = () => useContext(TridentRemoveHybridPoolContext)
