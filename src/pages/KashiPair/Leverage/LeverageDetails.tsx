import { Trade, TradeType } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Field } from '../../../state/swap/actions'
import { TYPE, ExternalLink } from '../../../theme'
import { AutoColumn } from '../../../components/Column'
import QuestionHelper from '../../../components/QuestionHelper'
import { RowBetween, RowFixed, AutoRow } from '../../../components/Row'

const LeverageDetails = () => {
  const theme = useContext(ThemeContext)
  return (
    <>
      <AutoColumn style={{ padding: '0 16px' }}>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text3}>
              {'Min DAI Recieved'}
            </TYPE.black>
          </RowFixed>
          <RowFixed>
            <TYPE.black color={theme.text3} fontSize={14}>
              10000.00
            </TYPE.black>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text3}>
              Leverage
            </TYPE.black>
          </RowFixed>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text3}>
              2x
            </TYPE.black>
            <QuestionHelper text="The difference between the market price and estimated price due to trade size." />
          </RowFixed>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text3}>
              Est. Liquidation Price:
            </TYPE.black>
          </RowFixed>
          <RowFixed>
            <TYPE.black fontSize={14} color={theme.text3}>
              30.24 USDC/DAI
            </TYPE.black>
            <QuestionHelper text="A portion of each trade (0.25%) goes to liquidity providers (LP) as a protocol incentive, and (0.05%) to xSUSHI holders." />
          </RowFixed>
        </RowBetween>
      </AutoColumn>
    </>
  )
}

export default LeverageDetails
