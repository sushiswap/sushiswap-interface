import React from 'react'
import TokenLogo from './TokenLogo'
import styled from 'styled-components'

const TokenWrapper = styled.div<{ sizeraw: number; margin?: boolean }>`
    position: relative;
    display: flex;
    flex-direction: row;
    margin-right: ${({ sizeraw, margin }) => margin && (sizeraw / 3 + 8).toString() + 'px'};
`

export default function DoubleTokenLogo({ a0, a1, size = 24, margin = false, higherRadius }: any) {
    return (
        <TokenWrapper sizeraw={size} margin={margin}>
            <TokenLogo address={a0} size={size.toString() + 'px'} sizeraw={size} higherRadius={higherRadius} />
            <TokenLogo address={a1} size={size.toString() + 'px'} sizeraw={size} />
        </TokenWrapper>
    )
}
