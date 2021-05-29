import React, { useContext, useRef, useState } from 'react'
import { RowBetween, RowFixed } from '../Row'
import styled, { ThemeContext } from 'styled-components'

import { AutoColumn } from '../Column'
import { ChainId } from '@sushiswap/sdk'
import QuestionHelper from '../QuestionHelper'
import Toggle from '../Toggle'
import Typography from '../Typography'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks'
import { useLingui } from '@lingui/react'

enum SlippageError {
    InvalidInput = 'InvalidInput',
    RiskyLow = 'RiskyLow',
    RiskyHigh = 'RiskyHigh',
}

enum DeadlineError {
    InvalidInput = 'InvalidInput',
}

const FancyButton = styled.button`
    color: #bfbfbf;
    align-items: center;
    height: 2rem;
    border-radius: 10px;
    font-size: 1rem;
    width: auto;
    min-width: 3.5rem;
    outline: none;
`

const Option = styled(FancyButton)<{ active: boolean }>`
    margin-right: 8px;
    :hover {
        cursor: pointer;
    }
    background-color: ${({ active }) => (active ? '#0D0415' : '#202231')};
    color: ${({ active }) => (active ? '#E3E3E3' : '#BFBFBF')};
`

const Input = styled.input`
    background: transparent;
    font-size: 16px;
    width: auto;
    outline: none;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    color: ${({ color }) => (color === 'red' ? '#FF3838' : '#BFBFBF')};
    text-align: left;
    ::placeholder {
        color: ${({ value }) =>
            value !== '' ? 'transparent' : 'currentColor'};
    }
`

const OptionCustom = styled(FancyButton)<{
    active?: boolean
    warning?: boolean
}>`
    height: 2rem;
    position: relative;
    padding: 0 0.75rem;
    flex: 1;
    background: #202231;
    input {
        width: 100%;
        height: 100%;
        border: 0px;
    }
`

const SlippageEmojiContainer = styled.span`
    color: #f3841e;
    //     ${({ theme }) => theme.mediaWidth.upToSmall`
//     display: none;  
//   `}
`

export interface SlippageTabsProps {
    rawSlippage: number
    setRawSlippage: (rawSlippage: number) => void
    deadline: number
    setDeadline: (deadline: number) => void
    useArcher: boolean
    setUseArcher: (useArcher: boolean) => void
}

export default function SlippageTabs({
    rawSlippage,
    setRawSlippage,
    deadline,
    setDeadline,
    useArcher,
    setUseArcher,
}: SlippageTabsProps) {
    const { i18n } = useLingui()
    const theme = useContext(ThemeContext)
    const { chainId } = useActiveWeb3React()

    const inputRef = useRef<HTMLInputElement>()

    const [slippageInput, setSlippageInput] = useState('')
    const [deadlineInput, setDeadlineInput] = useState('')

    const slippageInputIsValid =
        slippageInput === '' ||
        (rawSlippage / 100).toFixed(2) ===
            Number.parseFloat(slippageInput).toFixed(2)
    const deadlineInputIsValid =
        deadlineInput === '' || (deadline / 60).toString() === deadlineInput

    let slippageError: SlippageError | undefined
    if (slippageInput !== '' && !slippageInputIsValid) {
        slippageError = SlippageError.InvalidInput
    } else if (slippageInputIsValid && rawSlippage < 50) {
        slippageError = SlippageError.RiskyLow
    } else if (slippageInputIsValid && rawSlippage > 500) {
        slippageError = SlippageError.RiskyHigh
    } else {
        slippageError = undefined
    }

    let deadlineError: DeadlineError | undefined
    if (deadlineInput !== '' && !deadlineInputIsValid) {
        deadlineError = DeadlineError.InvalidInput
    } else {
        deadlineError = undefined
    }

    function parseCustomSlippage(value: string) {
        setSlippageInput(value)

        try {
            const valueAsIntFromRoundedFloat = Number.parseInt(
                (Number.parseFloat(value) * 100).toString()
            )
            if (
                !Number.isNaN(valueAsIntFromRoundedFloat) &&
                valueAsIntFromRoundedFloat < 5000
            ) {
                setRawSlippage(valueAsIntFromRoundedFloat)
            }
        } catch {}
    }

    function parseCustomDeadline(value: string) {
        setDeadlineInput(value)

        try {
            const valueAsInt: number = Number.parseInt(value) * 60
            if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
                setDeadline(valueAsInt)
            }
        } catch {}
    }

    console.log({ rawSlippage })

    return (
        <AutoColumn gap="md">
            <AutoColumn gap="sm">
                <RowFixed>
                    <Typography variant="body" className="text-high-emphesis">
                        {i18n._(t`Slippage tolerance`)}
                    </Typography>

                    <QuestionHelper
                        text={i18n._(
                            t`Your transaction will revert if the price changes unfavorably by more than this percentage.`
                        )}
                    />
                </RowFixed>
                <div className="flex items-center">
                    <Option
                        onClick={() => {
                            setSlippageInput('')
                            setRawSlippage(10)
                        }}
                        active={rawSlippage === 10}
                    >
                        0.1%
                    </Option>
                    <Option
                        onClick={() => {
                            setSlippageInput('')
                            setRawSlippage(50)
                        }}
                        active={rawSlippage === 50}
                    >
                        0.5%
                    </Option>
                    <Option
                        onClick={() => {
                            setSlippageInput('')
                            setRawSlippage(100)
                        }}
                        active={rawSlippage === 100}
                    >
                        1%
                    </Option>
                    <OptionCustom
                        active={![10, 50, 100].includes(rawSlippage)}
                        warning={!slippageInputIsValid}
                        tabIndex={-1}
                    >
                        <div className="flex items-center">
                            {/* {!!slippageInput &&
                            (slippageError === SlippageError.RiskyLow ||
                                slippageError === SlippageError.RiskyHigh) ? (
                                <SlippageEmojiContainer>
                                    <span role="img" aria-label="warning">
                                        ⚠️
                                    </span>
                                </SlippageEmojiContainer>
                            ) : null} */}
                            {/* https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451 */}
                            <Input
                                ref={inputRef as any}
                                placeholder={(rawSlippage / 100).toFixed(2)}
                                value={slippageInput}
                                onBlur={() => {
                                    parseCustomSlippage(
                                        (rawSlippage / 100).toFixed(2)
                                    )
                                }}
                                onChange={(e) =>
                                    parseCustomSlippage(e.target.value)
                                }
                                color={!slippageInputIsValid ? 'red' : ''}
                                style={{
                                    height: '24px',
                                    marginRight: '4px',
                                    borderRadius: 0,
                                }}
                            />
                            <div>%</div>
                        </div>
                    </OptionCustom>
                </div>
                {!!slippageError && (
                    <RowBetween
                        style={{
                            fontSize: '14px',
                            paddingTop: '7px',
                            color:
                                slippageError === SlippageError.InvalidInput
                                    ? 'red'
                                    : '#F3841E',
                        }}
                    >
                        {slippageError === SlippageError.InvalidInput
                            ? i18n._(t`Enter a valid slippage percentage`)
                            : slippageError === SlippageError.RiskyLow
                            ? i18n._(t`Your transaction may fail`)
                            : i18n._(t`Your transaction may be frontrun`)}
                    </RowBetween>
                )}
            </AutoColumn>

            <AutoColumn gap="sm">
                <RowFixed>
                    <Typography variant="body" className="text-high-emphesis">
                        {i18n._(t`Transaction deadline`)}
                    </Typography>

                    <QuestionHelper
                        text={i18n._(
                            t`Your transaction will revert if it is pending for more than this long.`
                        )}
                    />
                </RowFixed>
                <div className="flex items-center">
                    <OptionCustom
                        style={{ maxWidth: '40px', marginRight: '8px' }}
                        tabIndex={-1}
                    >
                        <Input
                            color={!!deadlineError ? 'red' : undefined}
                            onBlur={() => {
                                parseCustomDeadline((deadline / 60).toString())
                            }}
                            placeholder={(deadline / 60).toString()}
                            value={deadlineInput}
                            onChange={(e) =>
                                parseCustomDeadline(e.target.value)
                            }
                            style={{
                                borderRadius: 0,
                            }}
                        />
                    </OptionCustom>
                    <Typography variant="caption2">
                        {i18n._(t`minutes`)}
                    </Typography>
                </div>
            </AutoColumn>

            {chainId === ChainId.MAINNET && (
                <AutoColumn gap="sm">
                    <RowBetween>
                        <RowFixed>
                            <Typography variant="caption2">
                                {i18n._(t`MEV Shield by Archer DAO`)}
                            </Typography>
                            <QuestionHelper
                                text={i18n._(
                                    t`Send transaction privately to avoid front-running and sandwich attacks. Requires a miner tip to incentivize miners`
                                )}
                            />
                        </RowFixed>
                        <Toggle
                            id="toggle-use-archer"
                            isActive={useArcher}
                            toggle={() => setUseArcher(!useArcher)}
                        />
                    </RowBetween>
                </AutoColumn>
            )}
        </AutoColumn>
    )
}
