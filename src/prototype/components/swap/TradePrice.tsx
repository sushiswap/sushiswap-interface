import React from 'react'
import { Price } from '@sushiswap/sdk'
import { useContext } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../../hooks'

const RepeatIconWrapper = styled.span`
  width: 20px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

interface TradePriceProps {
  price?: Price
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
}

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
  const label = !showInverted ? (
    <span>
      <strong>{formattedPrice}</strong> {price?.quoteCurrency?.getSymbol(chainId)} = <strong>1</strong>{' '}
      {price?.baseCurrency?.getSymbol(chainId)}
    </span>
  ) : (
    <span>
      <strong>{formattedPrice}</strong> {price?.baseCurrency?.getSymbol(chainId)} = <strong>1</strong>{' '}
      {price?.quoteCurrency?.getSymbol(chainId)}
    </span>
  )

  return (
    <Text
      fontWeight={500}
      fontSize={13}
      color={theme.text3}
      style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}
    >
      {show ? (
        <>
          {label ?? '-'}
          <RepeatIconWrapper role="button" onClick={() => setShowInverted(!showInverted)}>
            <Repeat size={14} />
          </RepeatIconWrapper>
        </>
      ) : (
        '-'
      )}
    </Text>
  )
}
