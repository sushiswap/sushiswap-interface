import React, { createContext, useCallback, useContext, useMemo } from 'react'
import { useTridentAddParentPageContext } from '../index'
import { Context } from './types'

export const TridentAddHybridPoolContext = createContext<Context>({
  execute: () => null,
})

export const TridentAddHybridPoolContextProvider = ({ children }) => {
  const parent = useTridentAddParentPageContext()

  const execute = useCallback(async () => {
    // Do some custom execution
    alert('Executing HybridPool execute function')

    // Call parent execute to do some default execution stuff
    parent.execute()
  }, [parent])

  return (
    <TridentAddHybridPoolContext.Provider value={useMemo(() => ({ execute }), [execute])}>
      {children}
    </TridentAddHybridPoolContext.Provider>
  )
}

export const useTridentAddHybridPoolPageContext = () => useContext(TridentAddHybridPoolContext)
