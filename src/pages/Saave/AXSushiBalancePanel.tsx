import { Pair } from '@sushiswap/sdk'
import { darken } from 'polished'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import useTokenBalance from 'hooks/useTokenBalance'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { RowBetween } from '../../components/Row'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import useTheme from '../../hooks/useTheme'
import { TYPE } from '../../theme'
import { formatFromBalance } from '../../utils'

const InputRow = styled.div<{ selected: boolean }>`
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
    padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const LabelRow = styled.div`
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
    color: ${({ theme }) => theme.text1};
    font-size: 0.75rem;
    line-height: 1rem;
    padding: 0.75rem 1rem 0 1rem;
    span:hover {
        cursor: pointer;
        color: ${({ theme }) => darken(0.2, theme.text2)};
    }
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
    ${({ theme }) => theme.flexColumnNoWrap}
    position: relative;
    border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
    background-color: ${({ theme }) => theme.bg2};
    z-index: 1;
`

const Container = styled.div<{ hideInput: boolean; cornerRadiusTopNone?: boolean; cornerRadiusBottomNone?: boolean }>`
    border-radius: ${({ hideInput }) => (hideInput ? '8px' : '12px')};
    border-radius: ${({ cornerRadiusTopNone }) => cornerRadiusTopNone && '0 0 12px 12px'};
    border-radius: ${({ cornerRadiusBottomNone }) => cornerRadiusBottomNone && '12px 12px 0 0'};
    border: 1px solid ${({ theme }) => theme.bg2};
    background-color: ${({ theme }) => theme.bg1};
`

const StyledButtonName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 auto;' : '  margin: 0 auto;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};
`

const StyledBalanceMax = styled.button`
    height: 28px;
    padding-right: 8px;
    padding-left: 8px;
    background-color: ${({ theme }) => theme.primary5};
    border: 1px solid ${({ theme }) => theme.primary5};
    border-radius: ${({ theme }) => theme.borderRadius};
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

interface CurrencyInputPanelProps {
    label?: string
    lpTokenAddress?: string
    disableCurrencySelect?: boolean
    hideBalance?: boolean
    pair?: Pair | null
    hideInput?: boolean
    id: string
    customBalanceText?: string
    buttonText?: string
    cornerRadiusBottomNone?: boolean
    cornerRadiusTopNone?: boolean
}

export default function CurrencyInputPanel({
    label = 'Input',
    lpTokenAddress,
    disableCurrencySelect = false,
    hideBalance = false,
    hideInput = false,
    id,
    customBalanceText,
    buttonText,
    cornerRadiusBottomNone,
    cornerRadiusTopNone
}: CurrencyInputPanelProps) {
    const { t } = useTranslation()
    const { account } = useActiveWeb3React()
    const theme = useTheme()

    const aXSushiBalanceBigInt = useTokenBalance('0xF256CC7847E919FAc9B808cC216cAc87CCF2f47a')
    const aXSushiBalance = formatFromBalance(aXSushiBalanceBigInt?.value, aXSushiBalanceBigInt?.decimals)

    return (
        <>
            {/* Deposit Input */}
            <InputPanel id={id}>
                <Container
                    hideInput={hideInput}
                    cornerRadiusBottomNone={cornerRadiusBottomNone}
                    cornerRadiusTopNone={cornerRadiusTopNone}
                >
                    {!hideInput && (
                        <LabelRow>
                            <RowBetween>
                                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                                    {label}
                                </TYPE.body>
                            </RowBetween>
                        </LabelRow>
                    )}
                    <InputRow
                        style={hideInput ? { padding: '0', borderRadius: '8px' } : {}}
                        selected={disableCurrencySelect}
                    >
                        {!hideInput && (
                            <>
                                <NumericalInput
                                    className="token-amount-input"
                                    value={aXSushiBalance}
                                    onUserInput={() => null}
                                />
                            </>
                        )}
                    </InputRow>
                </Container>
            </InputPanel>
        </>
    )
}
