import React, { createContext, useCallback, useContext, useMemo } from 'react'
import { useTridentParentPageContext } from '../index'
import { Context } from './types'

export const TridentRemoveClassicPoolContext = createContext<Context>({
  execute: () => null,
})

export const TridentRemoveClassicPoolContextProvider = ({ children }) => {
  const parent = useTridentParentPageContext()

  const execute = useCallback(async () => {
    // Do some custom execution
    alert('Executing ClassicPool execute function')

    // Call parent execute to do some default execution stuff
    parent.execute()
  }, [parent])

  return (
    <TridentRemoveClassicPoolContext.Provider value={useMemo(() => ({ execute }), [execute])}>
      {children}
    </TridentRemoveClassicPoolContext.Provider>
  )
}

export const useTridentRemoveClassicPoolPageContext = () => useContext(TridentRemoveClassicPoolContext)
