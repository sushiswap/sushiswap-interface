import React, { createContext, ReactNode, useContext } from 'react'

import CalculateService from '../services/utils/CalculateService'
import TokenUtilService from '../services/utils/TokenUtilService'

export const handleLogoError = (event: React.SyntheticEvent) => {
  const imgElement = event.target as HTMLImageElement
  imgElement.src = '/images/tokens/icon-quiz.jpg'
}
interface AppContextProps {
  handleLogoError: (event: React.SyntheticEvent) => void
  calculateService: CalculateService
  tokenUtilService: TokenUtilService
}
const AppContext = createContext<AppContextProps>({} as AppContextProps)

export const AnalyticsKashiAppContextProvider = ({ children }: { children: ReactNode }) => {
  const calculateService = CalculateService.getInstance()
  const tokenUtilService = TokenUtilService.getInstance()

  return (
    <AppContext.Provider
      value={{
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

export const useCalculateService = () => {
  const { calculateService } = useAppContext()
  return calculateService
}

export const useTokenUtilService = () => {
  const { tokenUtilService } = useAppContext()
  return tokenUtilService
}
