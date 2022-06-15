import React, { createContext, ReactNode, useContext } from 'react'

import { API_URL } from '../config/constants'
import CoinGeckoService from '../services/data/CoinGeckoService'
import { DataService } from '../services/data/DataTypes'
import RestDataService from '../services/data/RestDataService'
import CalculateService from '../services/utils/CalculateService'
import TokenUtilService from '../services/utils/TokenUtilService'

export const handleLogoError = (event: React.SyntheticEvent) => {
  const imgElement = event.target as HTMLImageElement
  imgElement.src = '/images/tokens/icon-quiz.jpg'
}
interface AppContextProps {
  dataService: DataService
  handleLogoError: (event: React.SyntheticEvent) => void
  coinGeckoService: CoinGeckoService
  calculateService: CalculateService
  tokenUtilService: TokenUtilService
}
const AppContext = createContext<AppContextProps>({} as AppContextProps)

export const AnalyticsKashiAppContextProvider = ({ children }: { children: ReactNode }) => {
  const dataService = RestDataService(API_URL)
  const coinGeckoService = CoinGeckoService.getInstance()
  const calculateService = CalculateService.getInstance()
  const tokenUtilService = TokenUtilService.getInstance()

  return (
    <AppContext.Provider
      value={{
        dataService,
        coinGeckoService,
        calculateService,
        tokenUtilService,
        handleLogoError,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppContext)
}

export const useDataService = () => {
  const { dataService } = useAppContext()
  return dataService
}

export const useCoingeckoService = () => {
  const { coinGeckoService } = useAppContext()
  return coinGeckoService
}

export const useCalculateService = () => {
  const { calculateService } = useAppContext()
  return calculateService
}

export const useTokenUtilService = () => {
  const { tokenUtilService } = useAppContext()
  return tokenUtilService
}
