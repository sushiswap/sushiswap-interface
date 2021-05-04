import React from 'react'
import styled from 'styled-components'
import { useLastTruthy } from '../../hooks/useLast'
import { AdvancedLiquidityDetails, AdvancedLiquidityDetailsProps } from './AdvancedLiquidityDetails'

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
    padding-top: calc(16px + 2rem);
    padding-bottom: 16px;
    margin-top: -2rem;
    width: 100%;
    max-width: 544px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    color: ${({ theme }) => theme.text2};
    background-color: #202231;
    // background-color: ${({ theme }) => theme.advancedBG};
    z-index: -1;

    transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
    transition: transform 300ms ease-in-out;
`

export default function AdvancedSwapDetailsDropdown({ trade, show, ...rest }: AdvancedLiquidityDetailsProps) {
    const lastTrade = useLastTruthy(trade)

    return (
        <AdvancedDetailsFooter show={Boolean(show)}>
            <AdvancedLiquidityDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
        </AdvancedDetailsFooter>
    )
}
