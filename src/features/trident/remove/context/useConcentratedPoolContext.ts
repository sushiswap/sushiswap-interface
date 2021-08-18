import { useCallback, useMemo } from 'react'
import { Context } from './types'

// Input arguments must be exactly the same format as output
const useConcentratedPoolContext = ({ execute: executeProp }: Partial<Context>): Partial<Context> => {
  const execute = useCallback(async () => {
    // Do some custom execution
    alert('Executing ConcentratedPool execute function')

    // Call parent execute to do some default execution stuff
    executeProp()
  }, [executeProp])

  return useMemo(
    () => ({
      execute,
    }),
    [execute]
  )
}

export default useConcentratedPoolContext
