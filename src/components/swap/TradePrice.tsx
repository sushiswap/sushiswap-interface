import { Price } from '@sushiswap/sdk'
import React, { useContext } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { StyledBalanceMaxMini } from './styleds'

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
    const label = showInverted
        ? `${price?.quoteCurrency?.getSymbol(chainId)} per ${price?.baseCurrency?.getSymbol(chainId)}`
        : `${price?.baseCurrency?.getSymbol(chainId)} per ${price?.quoteCurrency?.getSymbol(chainId)}`

    return (
        <Text
            fontWeight={500}
            fontSize={14}
            color={theme.text3}
            style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}
        >
            {show ? (
                <>
                    {formattedPrice ?? '-'} {label}
                    <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
                        <Repeat size={14} />
                    </StyledBalanceMaxMini>
                </>
            ) : (
                '-'
            )}
        </Text>
    )
}
