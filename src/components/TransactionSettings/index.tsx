import { CurrencyAmount, ETHER } from '@sushiswap/sdk'
import { darken } from 'polished'
import React, { useContext, useRef, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import { tryParseAmount } from '../../state/swap/hooks'
import Toggle from '../Toggle'

enum SlippageError {
    InvalidInput = 'InvalidInput',
    RiskyLow = 'RiskyLow',
    RiskyHigh = 'RiskyHigh'
}

enum DeadlineError {
    InvalidInput = 'InvalidInput'
}

enum ETHTipError {
    InvalidInput = 'InvalidInput'
}

const FancyButton = styled.button`
    color: ${({ theme }) => theme.text1};
    align-items: center;
    height: 2rem;
    border-radius: 5px;
    font-size: 1rem;
    width: auto;
    min-width: 3.5rem;
    border: 1px solid ${({ theme }) => theme.bg3};
    outline: none;
    background: ${({ theme }) => theme.bg1};
    :hover {
        border: 1px solid ${({ theme }) => theme.bg4};
    }
    :focus {
        border: 1px solid ${({ theme }) => theme.primary1};
    }
`

const Option = styled(FancyButton)<{ active: boolean }>`
    margin-right: 8px;
    :hover {
        cursor: pointer;
    }
    background-color: ${({ active, theme }) => active && theme.primary1};
    color: ${({ active, theme }) => (active ? theme.white : theme.text1)};
`

const Input = styled.input`
    background: ${({ theme }) => theme.bg1};
    font-size: 16px;
    width: auto;
    outline: none;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    color: ${({ theme, color }) => (color === 'red' ? theme.red1 : theme.text1)};
    text-align: right;
`

const OptionCustom = styled(FancyButton)<{ active?: boolean; warning?: boolean }>`
    height: 2rem;
    position: relative;
    padding: 0 0.75rem;
    flex: 1;
    border: ${({ theme, active, warning }) => active && `1px solid ${warning ? theme.red1 : theme.primary1}`};
    :hover {
        border: ${({ theme, active, warning }) =>
            active && `1px solid ${warning ? darken(0.1, theme.red1) : darken(0.1, theme.primary1)}`};
    }

    input {
        width: 100%;
        height: 100%;
        border: 0px;
        border-radius: 2rem;
    }
`

const SlippageEmojiContainer = styled.span`
    color: #f3841e;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;  
  `}
`

export interface SlippageTabsProps {
    rawSlippage: number
    setRawSlippage: (rawSlippage: number) => void
    deadline: number
    setDeadline: (deadline: number) => void
    ethTip: string,
    setETHTip: (ethTip: string) => void,
    useArcher: boolean,
    setUseArcher: (useArcher: boolean) => void
}

export default function SlippageTabs({ rawSlippage, setRawSlippage, deadline, setDeadline, ethTip, setETHTip, useArcher, setUseArcher }: SlippageTabsProps) {
    const theme = useContext(ThemeContext)

    const inputRef = useRef<HTMLInputElement>()

    const [slippageInput, setSlippageInput] = useState('')
    const [deadlineInput, setDeadlineInput] = useState('')
    const [ethTipInput, setETHTipInput] = useState('')

    const slippageInputIsValid =
        slippageInput === '' || (rawSlippage / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
    const deadlineInputIsValid = deadlineInput === '' || (deadline / 60).toString() === deadlineInput
    const ethTipInputIsValid = ethTipInput === '' || CurrencyAmount.ether(ethTip).toExact() === ethTipInput

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

    let ethTipError: ETHTipError | undefined
    if (ethTipInput !== '' && !ethTipInputIsValid) {
        ethTipError = ETHTipError.InvalidInput
    } else {
        ethTipError = undefined
    } 

    function parseCustomSlippage(value: string) {
        setSlippageInput(value)

        try {
            const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
            if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
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

    function parseCustomETHTip(value: string) {
        setETHTipInput(value)
    
        try {
          const valueAsCurrencyAmount = tryParseAmount(value, ETHER)
          if (valueAsCurrencyAmount)
            setETHTip(valueAsCurrencyAmount.raw.toString())
        } catch {}
    }

    return (
        <AutoColumn gap="md">
            <AutoColumn gap="sm">
                <RowFixed>
                    <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                        Slippage tolerance
                    </TYPE.black>
                    <QuestionHelper text="Your transaction will revert if the price changes unfavorably by more than this percentage." />
                </RowFixed>
                <RowBetween>
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
                        <RowBetween>
                            {!!slippageInput &&
                            (slippageError === SlippageError.RiskyLow || slippageError === SlippageError.RiskyHigh) ? (
                                <SlippageEmojiContainer>
                                    <span role="img" aria-label="warning">
                                        ⚠️
                                    </span>
                                </SlippageEmojiContainer>
                            ) : null}
                            {/* https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451 */}
                            <Input
                                ref={inputRef as any}
                                placeholder={(rawSlippage / 100).toFixed(2)}
                                value={slippageInput}
                                onBlur={() => {
                                    parseCustomSlippage((rawSlippage / 100).toFixed(2))
                                }}
                                onChange={e => parseCustomSlippage(e.target.value)}
                                color={!slippageInputIsValid ? 'red' : ''}
                            />
                            %
                        </RowBetween>
                    </OptionCustom>
                </RowBetween>
                {!!slippageError && (
                    <RowBetween
                        style={{
                            fontSize: '14px',
                            paddingTop: '7px',
                            color: slippageError === SlippageError.InvalidInput ? 'red' : '#F3841E'
                        }}
                    >
                        {slippageError === SlippageError.InvalidInput
                            ? 'Enter a valid slippage percentage'
                            : slippageError === SlippageError.RiskyLow
                            ? 'Your transaction may fail'
                            : 'Your transaction may be frontrun'}
                    </RowBetween>
                )}
            </AutoColumn>

            <AutoColumn gap="sm">
                <RowFixed>
                    <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                        Transaction deadline
                    </TYPE.black>
                    <QuestionHelper text="Your transaction will revert if it is pending for more than this long." />
                </RowFixed>
                <RowFixed>
                    <OptionCustom style={{ width: '80px' }} tabIndex={-1}>
                        <Input
                            color={!!deadlineError ? 'red' : undefined}
                            onBlur={() => {
                                parseCustomDeadline((deadline / 60).toString())
                            }}
                            placeholder={(deadline / 60).toString()}
                            value={deadlineInput}
                            onChange={e => parseCustomDeadline(e.target.value)}
                        />
                    </OptionCustom>
                    <TYPE.body style={{ paddingLeft: '8px' }} fontSize={14}>
                        minutes
                    </TYPE.body>
                </RowFixed>
            </AutoColumn>

            <AutoColumn gap="sm">
                <RowBetween>
                    <RowFixed>
                        <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                            MEV Shield by Archer DAO
                        </TYPE.black>
                        <QuestionHelper text="Send transaction privately to avoid front-running and sandwich attacks. Requires a miner tip to incentivize miners" />
                    </RowFixed>
                        <Toggle
                            id="toggle-use-archer"
                            isActive={useArcher}
                            toggle={() => setUseArcher(!useArcher)} />
                </RowBetween>
            </AutoColumn>

            <AutoColumn gap="sm">
                <RowFixed>
                    <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                        MEV Shield Miner Tip
                    </TYPE.black>
                    <QuestionHelper text="Tip in ETH to pay to miner to include your transaction if using the Archer Network. Must be greater than competitive gas cost or transaction will not be mined." />
                    </RowFixed>
                    <RowFixed>
                    <OptionCustom style={{ width: '80px' }} tabIndex={-1}>
                        <Input
                        color={!!ethTipError ? 'red' : undefined}
                        onBlur={() => {
                            parseCustomETHTip(CurrencyAmount.ether(ethTip).toExact())
                        }}
                        placeholder={CurrencyAmount.ether(ethTip).toExact()}
                        value={ethTipInput}
                        onChange={e => parseCustomETHTip(e.target.value)}
                        />
                    </OptionCustom>
                    <TYPE.body style={{ paddingLeft: '8px' }} fontSize={14}>
                        ETH
                    </TYPE.body>
                </RowFixed>
            </AutoColumn>
            
        </AutoColumn>
    )
}
