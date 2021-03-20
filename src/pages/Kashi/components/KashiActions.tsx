import React, { useState } from 'react'
import useTheme from 'hooks/useTheme'
import { TYPE } from 'theme'
import { Dots } from '.'
import { ButtonPink } from 'components/Button'
import { RowBetween, AutoRow } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { Input as NumericalInput } from 'components/NumericalInput'
import { ArrowDownRight } from 'react-feather'
import styled from 'styled-components'
import { useActiveWeb3React } from 'hooks'
import { darken } from 'polished'
import { ApprovalState, useApproveCallback } from 'sushi-hooks/useApproveCallback'
import { useBentoBoxContract } from 'sushi-hooks/useContract'

export const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.mediumEmphesisText};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 0;
`
interface InputContext {
  action: string
  tokenAddress: string
  tokenSymbol: string
  direction: string
  label: string
  value: string
}

// export const InputContainer = styled.div`
//   height: 64px;
//   border-radius: 20px;
//   background-color: #2e3348;
//   z-index: 1;
// `

export const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 20px;
  background-color: #2e3348;
  padding: 0.75rem 0.5rem 0.75rem 1rem;
`

export const ButtonSelect = styled.button`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.primary1};
  background-color: #293a50;
  color: ${({ theme }) => theme.white};
  border-radius: ${({ theme }) => theme.borderRadius};
  border-radius: 6px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;
  margin: 0 0.25rem;
  width: 6rem;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary1)};
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
`

export const Container = styled.div<{
  cornerRadiusTopNone?: boolean
  cornerRadiusBottomNone?: boolean
}>`
  border-radius: 12px;
  border-radius: ${({ cornerRadiusTopNone }) => cornerRadiusTopNone && '0 0 12px 12px'};
  border-radius: ${({ cornerRadiusBottomNone }) => cornerRadiusBottomNone && '12px 12px 0 0'};
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`

export const StyledButtonName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 auto;' : '  margin: 0 auto;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};
`

export const StyledSwitch = styled.button`
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: ${({ theme }) => theme.borderRadius};
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

export const StyledBalanceMax = styled.button`
  height: 28px;
  padding-right: 8px;
  padding-left: 8px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: ${({ theme }) => theme.borderRadius};
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  z-index: 1;
`

interface KashiActions {
  pairAddress: string
  tokenAddress: string
  tokenSymbol: string

  action: string
  direction: string
  label: string
  value: string

  onUserInput?: (value: string) => void
  onMax?: () => void
}

export default function KashiActions({
  pairAddress,
  tokenAddress,
  tokenSymbol,
  action,
  direction,
  label,
  value,
  onUserInput = () => null,
  onMax = () => null
}: KashiActions) {
  const { account } = useActiveWeb3React()
  const theme = useTheme()
  const [sourceOrDestination, setSourceOrDestination] = useState<'BentoBox' | 'Wallet'>('BentoBox')
  const bentoBoxContract = useBentoBoxContract()
  const [approval, approveCallback] = useApproveCallback(tokenAddress, bentoBoxContract?.address)
  return (
    <Wrapper>
      <TYPE.largeHeader color={theme.highEmphesisText} fontWeight={700} fontSize={36}>
        {action} {tokenSymbol}
      </TYPE.largeHeader>

      <AutoColumn gap="md">
        <>
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.mediumEmphesisText} fontWeight={700} fontSize={16}>
                <span>
                  <ArrowDownRight size="1rem" style={{ display: 'inline' }} />
                </span>
                <span> {direction} </span>
                <span>
                  <StyledSwitch
                    onClick={() => setSourceOrDestination(sourceOrDestination === 'BentoBox' ? 'Wallet' : 'BentoBox')}
                  >
                    {sourceOrDestination}
                  </StyledSwitch>
                </span>
              </TYPE.body>
              <TYPE.body
                color={theme.mediumEmphesisText}
                fontWeight={700}
                fontSize={16}
                style={{ display: 'inline', cursor: 'pointer' }}
              >
                {label}: {value} {tokenSymbol}
              </TYPE.body>
            </RowBetween>
          </LabelRow>

          <InputRow>
            <>
              <NumericalInput value={value} onUserInput={onUserInput} />
              {account && <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>}
            </>
          </InputRow>
        </>
        {(approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING) && (
          <ButtonPink borderRadius="10px" padding="10px" disabled={!value}>
            {approval === ApprovalState.PENDING ? <Dots>Approving {tokenSymbol}</Dots> : `Approve ${tokenSymbol}`}
          </ButtonPink>
        )}
        {approval === ApprovalState.APPROVED && (
          <ButtonPink borderRadius="10px" padding="10px" disabled={!value}>
            {action}
          </ButtonPink>
        )}
      </AutoColumn>

      {/* <>
        <TYPE.mediumHeader color={theme.highEmphesisText} fontWeight={700} fontSize={24}>
          Transaction Review
        </TYPE.mediumHeader>
        <TYPE.body color={theme.mediumEmphesisText} fontWeight={700} fontSize={18}>
          Collateral Balance: ...
        </TYPE.body>
        <TYPE.body color={theme.mediumEmphesisText} fontWeight={700} fontSize={18}>
          Collateral Balance: ...
        </TYPE.body>
        <TYPE.body color={theme.mediumEmphesisText} fontWeight={700} fontSize={18}>
          Collateral Balance: ...
        </TYPE.body>
      </> */}
    </Wrapper>
  )
}
