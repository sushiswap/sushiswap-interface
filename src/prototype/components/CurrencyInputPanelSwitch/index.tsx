import React from 'react'
import styled from 'styled-components'

const StyledArrowIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  background-color: ${({ theme }) => theme.bg2};
  border: 3px solid ${({ theme }) => theme.bg1};
  padding: 6px;
  width: 36px;
  height: 36px;
`

const ArrowsIcon = () => {
  return (
    <svg
      style={{ height: '1.4rem', margin: '0 auto' }}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
      />
    </svg>
  )
}

interface CurrencyInputPanelSwitchProps {
  setApprovalSubmitted: (approval: boolean) => void
  onSwitchTokens: () => void
}

const CurrencyInputPanelSwitch = ({ setApprovalSubmitted, onSwitchTokens }: CurrencyInputPanelSwitchProps) => {
  return (
    <div style={{ position: 'relative', zIndex: 2, height: 12 }}>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          cursor: 'pointer',
          marginTop: '-12px',
          display: 'flex',
          justifyContent: 'center'
        }}
        onClick={() => {
          setApprovalSubmitted(false) // reset 2 step UI for approvals
          onSwitchTokens()
        }}
      >
        <StyledArrowIcon>
          <ArrowsIcon />
        </StyledArrowIcon>
      </div>
    </div>
  )
}

export default CurrencyInputPanelSwitch
