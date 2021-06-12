import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'

import React from 'react'
import styled from 'styled-components'
import { useLastTruthy } from '../../hooks/useLast'

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
    width: 100%;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    background-color: #202231;
    padding-top: calc(16px + 2rem);
    padding-bottom: 16px;
    margin-top: -2rem;
    max-width: 662px;
    padding-right: 10px;
    padding-left: 10px;
    transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
    transition: transform 300ms ease-in-out;
`

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
    const lastTrade = useLastTruthy(trade)
    return (
        <AdvancedDetailsFooter show={Boolean(trade)}>
            <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
        </AdvancedDetailsFooter>
    )
}
