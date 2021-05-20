import { Price } from '@sushiswap/sdk'
import React from 'react'
import { Repeat } from 'react-feather'
import { StyledBalanceMaxMini } from './styleds'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

interface TradePriceProps {
    price?: Price
    showInverted: boolean
    setShowInverted: (showInverted: boolean) => void
}

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
    const { chainId } = useActiveWeb3React()

    const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

    const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
    const label = showInverted
        ? `${price?.quoteCurrency?.getSymbol(chainId)} per ${price?.baseCurrency?.getSymbol(chainId)}`
        : `${price?.baseCurrency?.getSymbol(chainId)} per ${price?.quoteCurrency?.getSymbol(chainId)}`

    return (
        <div className="flex items-center justify-center font-medium">
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
        </div>
    )
}
