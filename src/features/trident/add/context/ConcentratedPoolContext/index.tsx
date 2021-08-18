import React, { createContext, useCallback, useContext, useMemo } from 'react'
import { useTridentAddParentPageContext } from '../index'
import { Context } from './types'

export const TridentAddConcentratedPoolContext = createContext<Context>({
  execute: () => null,
})

export const TridentAddConcentratedPoolContextProvider = ({ children }) => {
  const parent = useTridentAddParentPageContext()

  const execute = useCallback(async () => {
    // Do some custom execution
    alert('Executing ConcentratedPool execute function')

    // Call parent execute to do some default execution stuff
    parent.execute()
  }, [parent])

  return (
    <TridentAddConcentratedPoolContext.Provider value={useMemo(() => ({ execute }), [execute])}>
      {children}
    </TridentAddConcentratedPoolContext.Provider>
  )
}

export const useTridentAddConcentratedPoolPageContext = () => useContext(TridentAddConcentratedPoolContext)
