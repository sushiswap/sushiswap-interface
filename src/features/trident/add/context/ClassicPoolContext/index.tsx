import React, { createContext, useCallback, useContext, useMemo } from 'react'
import { useTridentAddParentPageContext } from '../index'
import { Context } from './types'

export const TridentAddClassicPoolContext = createContext<Context>({
  execute: () => null,
})

export const TridentAddClassicPoolContextProvider = ({ children }) => {
  const parent = useTridentAddParentPageContext()

  const execute = useCallback(async () => {
    // Do some custom execution
    alert('Executing ClassicPool execute function')

    // Call parent execute to do some default execution stuff
    parent.execute()
  }, [parent])

  return (
    <TridentAddClassicPoolContext.Provider value={useMemo(() => ({ execute }), [execute])}>
      {children}
    </TridentAddClassicPoolContext.Provider>
  )
}

export const useTridentAddClassicPoolPageContext = () => useContext(TridentAddClassicPoolContext)
