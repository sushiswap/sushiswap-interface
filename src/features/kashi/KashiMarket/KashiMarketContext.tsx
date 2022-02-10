import { KashiMarket } from 'app/features/kashi/types'
import { createContext, FC, useContext, useMemo } from 'react'

interface KashiMarketContext {
  market: KashiMarket
}

const Context = createContext<KashiMarketContext | undefined>(undefined)

const KashiMarketProvider: FC<KashiMarketContext> = ({ market, children }) => {
  return <Context.Provider value={useMemo(() => ({ market }), [market])}>{children}</Context.Provider>
}

export const useKashiMarket = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside Kashi Market Context')
  }

  return context
}

export default KashiMarketProvider
