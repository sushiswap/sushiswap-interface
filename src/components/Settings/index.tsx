import { MenuFlyout, StyledMenu, StyledMenuButton } from 'components/StyledMenu'
import React, { useContext, useRef, useState } from 'react'
import { Settings, X } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleSettingsMenu } from '../../state/application/hooks'
import {
    useExpertModeManager,
    useUserSingleHopOnly,
    useUserSlippageTolerance,
    useUserTransactionTTL
} from '../../state/user/hooks'
import { TYPE } from '../../theme'
import { ButtonError } from '../ButtonLegacy'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import Toggle from '../Toggle'
import TransactionSettings from '../TransactionSettings'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

const StyledMenuIcon = styled(Settings)`
    height: 20px;
    width: 20px;

    > * {
        stroke: ${({ theme }) => theme.text2};
    }

    :hover {
        opacity: 0.7;
    }
`

const StyledCloseIcon = styled(X)`
    height: 20px;
    width: 20px;
    :hover {
        cursor: pointer;
    }

    > * {
        stroke: ${({ theme }) => theme.text1};
    }
`

const EmojiWrapper = styled.div`
    position: absolute;
    bottom: -6px;
    right: 0px;
    font-size: 14px;
`

const Break = styled.div`
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.bg3};
`

const ModalContentWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 0;
    background-color: ${({ theme }) => theme.bg2};
    border-radius: 10px;
`

const ExtendedMenuFlyout = styled(MenuFlyout)`
    min-width: 22rem;
    margin-right: -20px;

    ${({ theme }) => theme.mediaWidth.upToMedium`
        min-width: 20rem;
        margin-right: -10px;
  `};
`

export default function SettingsTab() {
    const { i18n } = useLingui()

    const node = useRef<HTMLDivElement>(null)
    const open = useModalOpen(ApplicationModal.SETTINGS)
    const toggle = useToggleSettingsMenu()

    const theme = useContext(ThemeContext)
    const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()

    const [ttl, setTtl] = useUserTransactionTTL()

    const [expertMode, toggleExpertMode] = useExpertModeManager()

    const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()

    // show confirmation view before turning on
    const [showConfirmation, setShowConfirmation] = useState(false)

    useOnClickOutside(node, open ? toggle : undefined)

    return (
        <StyledMenu ref={node}>
            <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)} maxHeight={100}>
                <ModalContentWrapper>
                    <AutoColumn gap="lg">
                        <RowBetween style={{ padding: '0 2rem' }}>
                            <div />
                            <Text fontWeight={500} fontSize={20}>
                                {i18n._(t`Are you sure?`)}
                            </Text>
                            <StyledCloseIcon onClick={() => setShowConfirmation(false)} />
                        </RowBetween>
                        <Break />
                        <AutoColumn gap="lg" style={{ padding: '0 2rem' }}>
                            <Text fontWeight={500} fontSize={20}>
                                {t`Expert mode turns off the confirm transaction prompt and allows high slippage trades
                                that often result in bad rates and lost funds.`}
                            </Text>
                            <Text fontWeight={600} fontSize={20}>
                                {i18n._(t`ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.`)}
                            </Text>
                            <ButtonError
                                error={true}
                                padding={'12px'}
                                onClick={() => {
                                    if (
                                        window.prompt(
                                            i18n._(t`Please type the word "confirm" to enable expert mode.`)
                                        ) === 'confirm'
                                    ) {
                                        toggleExpertMode()
                                        setShowConfirmation(false)
                                    }
                                }}
                            >
                                <Text fontSize={20} fontWeight={500} id="confirm-expert-mode">
                                    {i18n._(t`Turn On Expert Mode`)}
                                </Text>
                            </ButtonError>
                        </AutoColumn>
                    </AutoColumn>
                </ModalContentWrapper>
            </Modal>
            <StyledMenuButton onClick={toggle} id="open-settings-dialog-button">
                <StyledMenuIcon />
                {/* {expertMode ? (
                    <EmojiWrapper>
                        <span role="img" aria-label="wizard-icon">
                            🧙
                        </span>
                    </EmojiWrapper>
                ) : null} */}
            </StyledMenuButton>
            {open && (
                <ExtendedMenuFlyout>
                    <AutoColumn gap="md" style={{ padding: '1rem' }}>
                        <div className="text-base font-semibold text-high-emphesis">
                            {i18n._(t`Transaction Settings`)}
                        </div>
                        <TransactionSettings
                            rawSlippage={userSlippageTolerance}
                            setRawSlippage={setUserslippageTolerance}
                            deadline={ttl}
                            setDeadline={setTtl}
                        />
                        <div className="text-base font-semibold text-high-emphesis">
                            {i18n._(t`Interface Settings`)}
                        </div>
                        <RowBetween>
                            <RowFixed>
                                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                                    {i18n._(t`Toggle Expert Mode`)}
                                </TYPE.black>
                                <QuestionHelper
                                    text={i18n._(
                                        t`Bypasses confirmation modals and allows high slippage trades. Use at your own risk.`
                                    )}
                                />
                            </RowFixed>
                            <Toggle
                                id="toggle-expert-mode-button"
                                isActive={expertMode}
                                toggle={
                                    expertMode
                                        ? () => {
                                              toggleExpertMode()
                                              setShowConfirmation(false)
                                          }
                                        : () => {
                                              toggle()
                                              setShowConfirmation(true)
                                          }
                                }
                            />
                        </RowBetween>
                        <RowBetween>
                            <RowFixed>
                                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                                    {i18n._(t`Disable Multihops`)}
                                </TYPE.black>
                                <QuestionHelper text={i18n._(t`Restricts swaps to direct pairs only.`)} />
                            </RowFixed>
                            <Toggle
                                id="toggle-disable-multihop-button"
                                isActive={singleHopOnly}
                                toggle={() => (singleHopOnly ? setSingleHopOnly(false) : setSingleHopOnly(true))}
                            />
                        </RowBetween>
                    </AutoColumn>
                </ExtendedMenuFlyout>
            )}
        </StyledMenu>
    )
}
