import React from 'react'
import styled from 'styled-components'
import { Input as PercentInput } from '../PercentInput'
import { RowBetween } from '../Row'

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
    @media (max-width: 500px) and (min-width: 480px) {
        min-width: 2rem;
        font-size: 0.8rem;
    }
    @media (max-width: 530px) and (min-width: 500px) {
        min-width: 2.5rem;
        font-size: 0.9rem;
    }
    @media (max-width: 570px) and (min-width: 530px) {
        min-width: 3rem;
        font-size: 1rem;
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

interface PercentInputPanelProps {
    value: string
    onUserInput: (value: string) => void
    id: string
}

export default function PercentInputPanel({ value, onUserInput, id }: PercentInputPanelProps) {
    return (
        <div id={id} className="rounded bg-dark-800 p-5">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row justify-between">
                <div className="w-full sm:w-2/5 text-white" style={{ margin: 'auto 0px' }}>
                    Amount to Remove
                </div>
                <div className="flex flex-col space-y-3 bg-dark-900 items-center rounded p-3 w-full sm:w-3/5 sm:flex-row-reverse sm:justify-between sm:space-y-0">
                    <div className="flex flex-row items-center font-bold text-xl w-20 sm:w-full">
                        <PercentInput
                            className="token-amount-input"
                            value={value}
                            onUserInput={val => {
                                onUserInput(val)
                            }}
                            align="right"
                        />
                        <div className="font-bold text-xl pl-2">%</div>
                    </div>
                    <div className="flex flex-row">
                        <Option
                            onClick={() => {
                                onUserInput("25")
                            }}
                            active={+value === 25}
                        >
                            25%
                        </Option>
                        <Option
                            onClick={() => {
                                onUserInput("50")
                            }}
                            active={+value === 50}
                        >
                            50%
                        </Option>
                        <Option
                            onClick={() => {
                                onUserInput("75")
                            }}
                            active={+value === 75}
                        >
                            75%
                        </Option>
                    </div>
                </div>
            </div>
        </div>
    )
}
