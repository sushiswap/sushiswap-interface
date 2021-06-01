import React from 'react'
import TokenLogo from './TokenLogo'
import styled from 'styled-components'

const TokenWrapper = styled.div<{ sizeraw: number; margin?: boolean }>`
    position: relative;
    display: flex;
    flex-direction: row;
    margin-right: ${({ sizeraw, margin }) =>
        margin && (sizeraw / 3 + 8).toString() + 'px'};
`

const HigherLogo = styled(TokenLogo)<{ higherRadius?: string }>`
    z-index: 2;
    // background-color: white;
    border-radius: ${({ higherRadius }) =>
        higherRadius ? higherRadius : '50%'};
`

const CoveredLogo = styled(TokenLogo)`
    position: absolute;
    left: ${({ sizeraw }) => (sizeraw / 1.2).toString() + 'px'};
    // background-color: white;
    border-radius: 50%;
`

export default function DoubleTokenLogo({
    a0,
    a1,
    size = 24,
    margin = false,
    higherRadius,
}: any) {
    return (
        <TokenWrapper sizeraw={size} margin={margin}>
            <HigherLogo
                address={a0}
                size={size.toString() + 'px'}
                sizeraw={size}
                higherRadius={higherRadius}
            />
            <CoveredLogo
                address={a1}
                size={size.toString() + 'px'}
                sizeraw={size}
            />
        </TokenWrapper>
    )
}
