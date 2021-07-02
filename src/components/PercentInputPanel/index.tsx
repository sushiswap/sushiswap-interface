import { Input as PercentInput } from '../PercentInput'
import React from 'react'
import styled from 'styled-components'

const FancyButton = styled.button`
  color: #bfbfbf;
  align-items: center;
  height: 2rem;
  border-radius: 10px;
  font-size: 1rem;
  width: auto;
  min-width: 3.5rem;
  outline: none;
  @media (max-width: 400px) and (min-width: 300px) {
    min-width: 2.3rem;
    font-size: 1rem;
  }
`

const Option = styled(FancyButton)<{ active: boolean }>`
  :hover {
    cursor: pointer;
  }
  background-color: ${({ active }) => (active ? '#0D0415' : '#202231')};
  color: ${({ active }) => (active ? '#E3E3E3' : '#BFBFBF')};
  margin-right: 5px;
`

interface PercentInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  id: string
}

export default function PercentInputPanel({ value, onUserInput, id }: PercentInputPanelProps) {
  return (
    <div id={id} className="p-5 rounded bg-dark-800">
      <div className="flex flex-col justify-between space-y-3 sm:space-y-0 sm:flex-row">
        <div className="w-full text-white sm:w-2/5" style={{ margin: 'auto 0px' }}>
          Amount to Remove
        </div>
        <div className="flex items-center w-full p-3 space-x-3 text-xl font-bold rounded bg-dark-900 sm:w-3/5">
          <div className="flex flex-row">
            <Option
              onClick={() => {
                onUserInput('25')
              }}
              active={+value === 25}
            >
              25%
            </Option>
            <Option
              onClick={() => {
                onUserInput('50')
              }}
              active={+value === 50}
            >
              50%
            </Option>
            <Option
              onClick={() => {
                onUserInput('75')
              }}
              active={+value === 75}
            >
              75%
            </Option>
          </div>

          <PercentInput
            className="token-amount-input"
            value={value}
            onUserInput={(val) => {
              onUserInput(val)
            }}
            align="right"
          />
          <div className="pl-2 text-xl font-bold">%</div>
        </div>
      </div>
    </div>
  )
}
