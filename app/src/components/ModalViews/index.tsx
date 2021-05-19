import { AutoColumn, ColumnCenter } from '../Column'
import { CloseIcon, CustomLightSpinner } from '../../theme'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

import { ArrowUpCircle } from 'react-feather'
import Circle from '../../assets/images/blue-loader.svg'
import ExternalLink from '../ExternalLink'
import { RowBetween } from '../Row'
import { getExplorerLink } from '../../functions/exporer'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

const ConfirmOrLoadingWrapper = styled.div`
    width: 100%;
    padding: 24px;
`

const ConfirmedIcon = styled(ColumnCenter)`
    padding: 60px 0;
`

export function LoadingView({ children, onDismiss }: { children: any; onDismiss: () => void }) {
    return (
        <ConfirmOrLoadingWrapper>
            <RowBetween>
                <div />
                <CloseIcon onClick={onDismiss} />
            </RowBetween>
            <ConfirmedIcon>
                <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
            </ConfirmedIcon>
            <AutoColumn gap="100px" justify={'center'}>
                {children}
                <div>Confirm this transaction in your wallet</div>
            </AutoColumn>
        </ConfirmOrLoadingWrapper>
    )
}

export function SubmittedView({
    children,
    onDismiss,
    hash
}: {
    children: any
    onDismiss: () => void
    hash: string | undefined
}) {
    const theme = useContext(ThemeContext)
    const { chainId } = useActiveWeb3React()

    return (
        <ConfirmOrLoadingWrapper>
            <RowBetween>
                <div />
                <CloseIcon onClick={onDismiss} />
            </RowBetween>
            <ConfirmedIcon>
                <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary1} />
            </ConfirmedIcon>
            <AutoColumn gap="100px" justify={'center'}>
                {children}
                {chainId && hash && (
                    <ExternalLink href={getExplorerLink(chainId, hash, 'transaction')} style={{ marginLeft: '4px' }}>
                        <div>View transaction on explorer</div>
                    </ExternalLink>
                )}
            </AutoColumn>
        </ConfirmOrLoadingWrapper>
    )
}
