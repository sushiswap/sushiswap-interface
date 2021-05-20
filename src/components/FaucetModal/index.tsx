import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { useFaucetContract } from '../../hooks/useContract'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useFaucetModalToggle } from '../../state/application/hooks'
import { TYPE } from '../../theme'
import Modal from '../Modal'
import TransactionConfirmationModal, { TransactionErrorContent } from '../TransactionConfirmationModal'

const Wrapper = styled.div`
    ${({ theme }) => theme.flexColumnNoWrap}
    margin: 0;
    padding: 0;
    width: 100%;
`

const HeaderRow = styled.div`
    ${({ theme }) => theme.flexRowNoWrap};
    padding: 1rem 1rem;
    font-weight: 500;
    color: ${props => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
    ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const UpperSection = styled.div`
    position: relative;

    h5 {
        margin: 0;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        font-weight: 400;
    }

    h5:last-child {
        margin-bottom: 0px;
    }

    h4 {
        margin-top: 0;
        font-weight: 500;
    }
`

const CloseIcon = styled.div`
    position: absolute;
    right: 1rem;
    top: 14px;
    &:hover {
        cursor: pointer;
        opacity: 0.6;
    }
`

const CloseColor = styled(Close)`
    path {
        stroke: ${({ theme }) => theme.text4};
`

const LowerSection = styled.div`
    ${({ theme }) => theme.flexColumnNoWrap}
    padding: 1.5rem;
    flex-grow: 1;
    overflow: auto;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;

    h5 {
        margin: 0;
        font-weight: 400;
        color: ${({ theme }) => theme.text3};
    }
`

export default function FaucetModal() {
    const theme = useContext(ThemeContext)

    const faucetModalOpen = useModalOpen(ApplicationModal.FAUCET)
    const toggleFaucetModal = useFaucetModalToggle()
    const faucetContract = useFaucetContract(true)

    const [isRunning, setRunning] = useState(false)
    const [isWaiting, setWaiting] = useState(false)
    const [faucetErrorMessage, setError] = useState('')
    const [txHash, setTxHash] = useState('')

    const claimFaucet = useCallback(() => {
        setRunning(true)
        setWaiting(true)
        setError('')
        setTxHash('')
        faucetContract?.drip()
        .then((tx: any) => {
            setWaiting(false)
            setTxHash(tx.hash)
        })
        .catch((err: any) => {
            if (err.code === 4001) {
                setError('Transaction rejected.')
            } else {
                console.error(`Claim failed`, err, 'drip')
                setError(`Claim failed: ${err.message}`)
            }
            setWaiting(false)
        })
    }, [faucetContract])

    useEffect(() => {
        if(faucetModalOpen) {
            setRunning(false)
        }
    }, [faucetModalOpen])

    function getModalContent() {
        return (
            <UpperSection>
                <CloseIcon onClick={toggleFaucetModal}>
                    <CloseColor />
                </CloseIcon>
                <HeaderRow>Faucet</HeaderRow>
                <LowerSection>
                    <TYPE.body color={theme.text1}>Claim your test tokens here...</TYPE.body>
                    <button
                        onClick={claimFaucet}
                        className="flex items-center bg-dark-800 hover:bg-dark-700 w-full rounded p-3 cursor-pointer mt-5"
                    >
                        <div className="text-primary font-bold text-center w-full">Claim</div>
                    </button>
                </LowerSection>
            </UpperSection>
        )
    }

    const confirmationContent = useCallback(
        () => <TransactionErrorContent onDismiss={toggleFaucetModal} message={faucetErrorMessage} />,
        [toggleFaucetModal, faucetErrorMessage]
    )

    return (
        !isRunning ?
            <Modal isOpen={faucetModalOpen} onDismiss={toggleFaucetModal} minHeight={false} maxHeight={90}>
                <Wrapper>{getModalContent()}</Wrapper>
            </Modal>
        :
            <TransactionConfirmationModal
                isOpen={faucetModalOpen}
                onDismiss={toggleFaucetModal}
                attemptingTxn={isWaiting}
                hash={txHash}
                content={confirmationContent}
                pendingText={'Claiming test tokens'}
            />
    )
}
