import { BalanceProps } from '../../hooks/useTokenBalance'
import React, { useContext } from 'react'
import MeowshiImage from '../../assets/images/meowshi.png'
import { formatFromBalance } from '../../utils'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'
import { useDarkModeManager } from '../../state/user/hooks'
import styled, { ThemeContext } from 'styled-components'
import { ExternalLink, TYPE } from '../../theme'

interface BalanceCardProps {
    sushiEarnings?: number
    nyanBalance: BalanceProps
    xSushiBalance: BalanceProps
    sushiBalance: BalanceProps
    weightedApr?: number
}

export default function BalanceCard({
    nyanBalance
}: BalanceCardProps) {
    const { i18n } = useLingui()
    const { account } = useActiveWeb3React()
    const darkMode = useDarkModeManager()
    const theme = useContext(ThemeContext)
    return (
      <div className="flex flex-col w-full bg-dark-400 rounded px-4 md:px-8 pt-6 pb-5 md:pt-7 md:pb-9">
          <div className="flex flex-wrap">
              <div className="flex flex-col flex-grow md:mb-14">
                  <div className="flex items-center">
                      <img className="w-10 md:w-16 -ml-1 mr-1 md:mr-2 -mb-1.5" src={MeowshiImage} alt="meowshi" />
                      <div className="flex flex-col justify-center">
                          <p className="text-caption2 md:text-lg font-bold text-high-emphesis">
                              {formatFromBalance(nyanBalance.value)}
                          </p>
                          <p className="text-caption2 md:text-caption text-primary">NYAN</p>
                          <ExternalLink
                                   style={{ color: `${darkMode ? 'white' : 'black'}`, textDecoration: 'underline' }}
                                   target="_blank"
                                   href="https://etherscan.io/address/0x4FA5116809B8428934D148c2975F366E8920F24b#code"
                               >
                                   <TYPE.white fontSize={14} color={theme.text1}>
                                       {i18n._(t`Read the contract`)}
                                   </TYPE.white>
                               </ExternalLink>
                      </div>
                  </div>
              </div>
            </div>
        </div>
    )
}
