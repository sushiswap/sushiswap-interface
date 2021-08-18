import { useCallback, useMemo } from 'react'
import { Context } from './types'

// Input arguments must be exactly the same format as output
const useClassicPoolContext = ({ execute: executeProp }: Partial<Context>): Partial<Context> => {
  const execute = useCallback(async () => {
    // Do some custom execution
    alert('Executing ClassicPool execute function')

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

export default useClassicPoolContext
