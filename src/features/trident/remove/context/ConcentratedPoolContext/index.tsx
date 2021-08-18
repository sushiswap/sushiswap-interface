import React, { createContext, useCallback, useContext, useMemo } from 'react'
import { useTridentParentPageContext } from '../index'
import { Context } from './types'

export const TridentRemoveConcentratedPoolContext = createContext<Context>({
  execute: () => null,
})

export const TridentRemoveConcentratedPoolContextProvider = ({ children }) => {
  const parent = useTridentParentPageContext()

  const execute = useCallback(async () => {
    // Do some custom execution
    alert('Executing ConcentratedPool execute function')

    // Call parent execute to do some default execution stuff
    parent.execute()
  }, [parent])

  return (
    <TridentRemoveConcentratedPoolContext.Provider value={useMemo(() => ({ execute }), [execute])}>
      {children}
    </TridentRemoveConcentratedPoolContext.Provider>
  )
}

export const useTridentRemoveConcentratedPoolPageContext = () => useContext(TridentRemoveConcentratedPoolContext)
