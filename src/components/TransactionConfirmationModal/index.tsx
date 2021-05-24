import { AlertTriangle, ArrowUpCircle } from 'react-feather'
import { AutoColumn, ColumnCenter } from '../Column'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

import { ButtonPrimary } from '../ButtonLegacy'
import { ChainId } from '@sushiswap/sdk'
import CloseIcon from '../CloseIcon'
import { CustomLightSpinner } from '../Spinner'
import ExternalLink from '../ExternalLink'
import Modal from '../Modal'
import { RowBetween } from '../Row'
import { Text } from 'rebass'
import { getExplorerLink } from '../../functions/explorer'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

const Wrapper = styled.div`
    width: 100%;
`
const Section = styled(AutoColumn)`
    // padding: 24px;
`

const BottomSection = styled(Section)`
    background-color: ${({ theme }) => theme.bg2};
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
`

const ConfirmedIcon = styled(ColumnCenter)`
    padding: 60px 0;
`

function ConfirmationPendingContent({ onDismiss, pendingText }: { onDismiss: () => void; pendingText: string }) {
    return (
        <Wrapper>
            <Section>
                <RowBetween>
                    <div />
                    <CloseIcon onClick={onDismiss} />
                </RowBetween>
                <ConfirmedIcon>
                    <CustomLightSpinner src="/blue-loader.svg" alt="loader" size={'90px'} />
                </ConfirmedIcon>
                <AutoColumn gap="12px" justify={'center'}>
                    <Text className="text-lg font-medium">Waiting For Confirmation</Text>
                    <AutoColumn gap="12px" justify={'center'}>
                        <Text fontWeight={600} fontSize={14} color="" textAlign="center">
                            {pendingText}
                        </Text>
                    </AutoColumn>
                    <Text fontSize={12} color="#565A69" textAlign="center">
                        Confirm this transaction in your wallet
                    </Text>
                </AutoColumn>
            </Section>
        </Wrapper>
    )
}

function TransactionSubmittedContent({
    onDismiss,
    chainId,
    hash
}: {
    onDismiss: () => void
    hash: string | undefined
    chainId: ChainId
}) {
    const theme = useContext(ThemeContext)

    return (
        <Wrapper>
            <Section>
                <RowBetween>
                    <div />
                    <CloseIcon onClick={onDismiss} />
                </RowBetween>
                <ConfirmedIcon>
                    <ArrowUpCircle strokeWidth={0.5} size={90} className="text-blue" />
                </ConfirmedIcon>
                <AutoColumn gap="12px" justify={'center'}>
                    <Text className="text-lg font-medium">Transaction Submitted</Text>
                    {chainId && hash && (
                        <ExternalLink href={getExplorerLink(chainId, hash, 'transaction')}>
                            <Text fontWeight={500} fontSize={14} className="text-blue">
                                View on explorer
                            </Text>
                        </ExternalLink>
                    )}
                    <ButtonPrimary onClick={onDismiss} style={{ margin: '20px 0 0 0' }}>
                        <Text className="text-lg font-medium">Close</Text>
                    </ButtonPrimary>
                </AutoColumn>
            </Section>
        </Wrapper>
    )
}

export function ConfirmationModalContent({
    title,
    bottomContent,
    onDismiss,
    topContent
}: {
    title: string
    onDismiss: () => void
    topContent: () => React.ReactNode
    bottomContent: () => React.ReactNode
}) {
    return (
        <Wrapper>
            <Section>
                <RowBetween>
                    <Text className="text-lg font-medium">{title}</Text>
                    <CloseIcon onClick={onDismiss} />
                </RowBetween>
                {topContent()}
            </Section>
            <BottomSection gap="12px">{bottomContent()}</BottomSection>
        </Wrapper>
    )
}

export function TransactionErrorContent({ message, onDismiss }: { message: string; onDismiss: () => void }) {
    const theme = useContext(ThemeContext)
    return (
        <Wrapper>
            <Section>
                <RowBetween>
                    <Text className="text-lg font-medium">Error</Text>
                    <CloseIcon onClick={onDismiss} />
                </RowBetween>
                <AutoColumn style={{ marginTop: 20, padding: '2rem 0' }} gap="24px" justify="center">
                    <AlertTriangle className="text-red" style={{ strokeWidth: 1.5 }} size={64} />
                    <Text
                        fontWeight={500}
                        fontSize={16}
                        className="text-red"
                        style={{ textAlign: 'center', width: '85%' }}
                    >
                        {message}
                    </Text>
                </AutoColumn>
            </Section>
            <BottomSection gap="12px">
                <ButtonPrimary onClick={onDismiss}>Dismiss</ButtonPrimary>
            </BottomSection>
        </Wrapper>
    )
}

interface ConfirmationModalProps {
    isOpen: boolean
    onDismiss: () => void
    hash: string | undefined
    content: () => React.ReactNode
    attemptingTxn: boolean
    pendingText: string
}

export default function TransactionConfirmationModal({
    isOpen,
    onDismiss,
    attemptingTxn,
    hash,
    pendingText,
    content
}: ConfirmationModalProps) {
    const { chainId } = useActiveWeb3React()

    if (!chainId) return null

    // confirmation screen
    return (
        <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
            {attemptingTxn ? (
                <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} />
            ) : hash ? (
                <TransactionSubmittedContent chainId={chainId} hash={hash} onDismiss={onDismiss} />
            ) : (
                content()
            )}
        </Modal>
    )
}
