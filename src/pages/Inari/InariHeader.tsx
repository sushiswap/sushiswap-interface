import React from 'react'
import styled from 'styled-components'
import { RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'

const StyledSwapHeader = styled.div`
    padding: 12px 1rem 0px 1.5rem;
    margin-bottom: -4px;
    width: 100%;
    max-width: 420px;
    color: ${({ theme }) => theme.text2};
`

interface SwapHeaderProps {
    label?: String
}

export default function SwapHeader({
    label = ''
}: SwapHeaderProps) {
    return (
        <StyledSwapHeader>
            <RowBetween>
                <TYPE.black fontWeight={500}>{label}</TYPE.black>
            </RowBetween>
        </StyledSwapHeader>
    )
}
