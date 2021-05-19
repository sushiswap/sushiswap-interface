import { ChainId, Currency, Pair } from '@sushiswap/sdk'
import React, { useCallback, useState } from 'react'

import Button from '../Button'
import CurrencyLogo from '../CurrencyLogo'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import DoubleCurrencyLogo from '../DoubleLogo'
import DropDown from '../../assets/images/dropdown.svg'
import Lottie from 'lottie-react'
import { Input as NumericalInput } from '../NumericalInput'
import { darken } from 'polished'
import { formattedNum } from '../../utils'
import selectCoinAnimation from '../../assets/animation/select-coin.json'
import styled from 'styled-components'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useLingui } from '@lingui/react'
import useTheme from '../../hooks/useTheme'
import { useUSDCPrice } from '../../hooks'

const InputRow = styled.div<{ selected: boolean }>`
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
    padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const CurrencySelect = styled.button<{ selected: boolean }>`
    align-items: center;
    height: 100%;
    font-size: 20px;
    font-weight: 500;
    // background-color: ${({ selected, theme }) => (selected ? theme.bg1 : theme.primary1)};
    // color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    // border-radius: ${({ theme }) => theme.borderRadius};
    // box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
    outline: none;
    cursor: pointer;
    user-select: none;
    border: none;
    // padding: 0 0.5rem;

    :focus,
    :hover {
        // background-color: ${({ selected, theme }) => (selected ? theme.bg2 : darken(0.05, theme.primary1))};
    }
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

const Aligner = styled.span`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
    margin: 0 0.25rem 0 0.5rem;
    height: 35%;

    path {
        stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
        stroke-width: 1.5px;
    }
`

const StyledTokenName = styled.span<{ active?: boolean }>`
    //   ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
    //   font-size:  ${({ active }) => (active ? '24px' : '12px')};
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
    value: string
    onUserInput: (value: string) => void
    onMax?: () => void
    showMaxButton: boolean
    label?: string
    onCurrencySelect?: (currency: Currency) => void
    currency?: Currency | null
    disableCurrencySelect?: boolean
    hideBalance?: boolean
    pair?: Pair | null
    hideInput?: boolean
    otherCurrency?: Currency | null
    id: string
    showCommonBases?: boolean
    customBalanceText?: string
    cornerRadiusBottomNone?: boolean
    cornerRadiusTopNone?: boolean
    containerBackground?: string
}

export default function CurrencyInputPanel({
    value,
    onUserInput,
    onMax,
    showMaxButton,
    label = 'Input',
    onCurrencySelect,
    currency,
    disableCurrencySelect = false,
    hideBalance = false,
    pair = null, // used for double token logo
    hideInput = false,
    otherCurrency,
    id,
    showCommonBases,
    customBalanceText,
    cornerRadiusBottomNone,
    cornerRadiusTopNone,
    containerBackground,
}: CurrencyInputPanelProps) {
    const { i18n } = useLingui()
    const [modalOpen, setModalOpen] = useState(false)
    const { account, chainId } = useActiveWeb3React()
    const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
    const theme = useTheme()

    const handleDismissSearch = useCallback(() => {
        setModalOpen(false)
    }, [setModalOpen])

    const currencyUSDC = useUSDCPrice(currency ? currency : undefined)?.toFixed(18)
    const valueUSDC = formattedNum(Number(value) * Number(currencyUSDC))

    return (
        <div id={id} className="rounded bg-dark-800 p-5">
            <div
                className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row justify-between"
                // hideInput={hideInput}
                // cornerRadiusBottomNone={cornerRadiusBottomNone}
                // cornerRadiusTopNone={cornerRadiusTopNone}
                // containerBackground={containerBackground}
            >
                {/* {!hideInput && (
                    <LabelRow>
                        <RowBetween>
                            <div color={theme.text3} fontWeight={500} fontSize={14}>
                                {label}
                            </div>
                            {account && (
                                <div
                                    onClick={onMax}
                                    color={theme.text3}
                                    fontWeight={500}
                                    fontSize={14}
                                    style={{ display: 'inline', cursor: 'pointer' }}
                                >
                                    {!hideBalance && !!currency && selectedCurrencyBalance
                                        ? (customBalanceText ?? 'Balance: ') + selectedCurrencyBalance?.toSignificant(6)
                                        : ' -'}
                                </div>
                            )}
                        </RowBetween>
                    </LabelRow>
                )} */}
                <div
                    className="w-full sm:w-2/5"
                    // style={hideInput ? { padding: '0', borderRadius: '8px' } : {}}
                    // selected={disableCurrencySelect}
                >
                    <CurrencySelect
                        selected={!!currency}
                        className="open-currency-select-button"
                        onClick={() => {
                            if (!disableCurrencySelect) {
                                setModalOpen(true)
                            }
                        }}
                    >
                        <div className="flex">
                            {pair ? (
                                <DoubleCurrencyLogo
                                    currency0={pair.token0}
                                    currency1={pair.token1}
                                    size={54}
                                    margin={true}
                                />
                            ) : currency ? (
                                <div className="flex-1">
                                    <CurrencyLogo currency={currency} size={'54px'} />
                                </div>
                            ) : (
                                <div className="bg-dark-700 rounded" style={{ maxWidth: 54, maxHeight: 54 }}>
                                    <div style={{ width: 54, height: 54 }}>
                                        <Lottie animationData={selectCoinAnimation} autoplay loop />
                                    </div>
                                </div>
                            )}
                            {pair ? (
                                <StyledTokenName className="pair-name-container">
                                    {pair?.token0.symbol}:{pair?.token1.symbol}
                                </StyledTokenName>
                            ) : (
                                <div className="flex flex-1 flex-col items-start justify-center mx-3.5">
                                    {label && (
                                        <div className="text-xs text-secondary font-medium whitespace-nowrap">
                                            {label}
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        {/* <StyledTokenName
                                            className="token-symbol-container"
                                            active={Boolean(currency && currency.symbol)}
                                        > */}
                                        <div className="text-lg md:text-2xl font-bold">
                                            {(currency && currency.symbol && currency.symbol.length > 20
                                                ? currency.symbol.slice(0, 4) +
                                                  '...' +
                                                  currency.symbol.slice(
                                                      currency.symbol.length - 5,
                                                      currency.symbol.length
                                                  )
                                                : currency?.getSymbol(chainId)) || (
                                                <div className="bg-transparent hover:bg-primary border border-low-emphesis rounded-full px-2 py-1 text-secondary text-xs font-medium mt-1 whitespace-nowrap ">
                                                    {i18n._(t`Select a token`)}
                                                </div>
                                            )}
                                        </div>
                                        {/* </StyledTokenName> */}
                                        {!disableCurrencySelect && currency && <StyledDropDown selected={!!currency} />}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CurrencySelect>
                    {/* {!hideInput && (
                        <>
                            <NumericalInput
                                className="token-amount-input"
                                value={value}
                                onUserInput={val => {
                                    onUserInput(val)
                                }}
                            />
                            {account && currency && showMaxButton && label !== 'To' && (
                                <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
                            )}
                        </>
                    )} */}
                </div>
                <div className="flex items-center rounded bg-dark-900 space-x-3 p-3 w-full sm:w-3/5">
                    {!hideInput && (
                        <>
                            {account && currency && showMaxButton && label !== 'To' && (
                                <Button
                                    onClick={onMax}
                                    size="small"
                                    className="bg-transparent hover:bg-primary border border-low-emphesis rounded-full text-secondary text-xs font-medium whitespace-nowrap"
                                >
                                    {i18n._(t`Max`)}
                                </Button>
                            )}
                            <NumericalInput
                                className="token-amount-input"
                                value={value}
                                onUserInput={(val) => {
                                    onUserInput(val)
                                }}
                            />
                            {account && (
                                <div className="flex flex-col">
                                    <div
                                        onClick={onMax}
                                        className="font-medium cursor-pointer text-xs text-low-emphesis"
                                    >
                                        {!hideBalance && !!currency && selectedCurrencyBalance
                                            ? (customBalanceText ?? 'Balance: ') +
                                              selectedCurrencyBalance?.toSignificant(6)
                                            : ' -'}
                                    </div>
                                    {chainId === ChainId.MAINNET && (
                                        <div className="font-medium text-xs text-secondary">≈ {valueUSDC} USDC</div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            {!disableCurrencySelect && onCurrencySelect && (
                <CurrencySearchModal
                    isOpen={modalOpen}
                    onDismiss={handleDismissSearch}
                    onCurrencySelect={onCurrencySelect}
                    selectedCurrency={currency}
                    otherSelectedCurrency={otherCurrency}
                    showCommonBases={showCommonBases}
                />
            )}
        </div>
    )
}
