import { Currency } from '@sushiswap/sdk'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import CurrencyLogo from '../CurrencyLogo'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import selectCoinAnimation from '../../assets/animation/select-coin.json'
import Lottie from 'lottie-react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

const CurrencySelect = styled.button<{ selected: boolean }>`
    align-items: center;
    height: 100%;
    font-size: 20px;
    font-weight: 500;
    outline: none;
    cursor: pointer;
    user-select: none;
    border: none;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
    margin: 0 0.25rem 0 0.5rem;
    height: 35%;

    path {
        stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
        stroke-width: 1.5px;
    }
`

interface CurrencySelectPanelProps {
    onClick?: () => void
    onCurrencySelect?: (currency: Currency) => void
    currency?: Currency | null
    disableCurrencySelect?: boolean
    otherCurrency?: Currency | null
    id: string
    showCommonBases?: boolean
}

export default function CurrencySelectPanel({
    onClick,
    onCurrencySelect,
    currency,
    disableCurrencySelect = false,
    otherCurrency,
    id,
    showCommonBases
}: CurrencySelectPanelProps) {
    const { i18n } = useLingui()

    const [modalOpen, setModalOpen] = useState(false)
    const { chainId } = useActiveWeb3React()

    const handleDismissSearch = useCallback(() => {
        setModalOpen(false)
    }, [setModalOpen])

    return (
        <div id={id} className="rounded bg-dark-800 p-5">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row justify-between">
                <div className="w-full" onClick={onClick}>
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
                            {currency ? (
                                <CurrencyLogo currency={currency} size={'54px'} />
                            ) : (
                                <div className="bg-dark-700 rounded" style={{ maxWidth: 54, maxHeight: 54 }}>
                                    <div style={{ width: 54, height: 54 }}>
                                        <Lottie animationData={selectCoinAnimation} autoplay loop />
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col items-start justify-center mx-3.5">
                                <div className="flex items-center">
                                    <div className="text-lg md:text-2xl font-bold">
                                        {(currency && currency.symbol && currency.symbol.length > 20
                                            ? currency.symbol.slice(0, 4) +
                                              '...' +
                                              currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                                            : currency?.getSymbol(chainId)) || (
                                            <div className="bg-cyan-blue hover:bg-opacity-90 border border-low-emphesis rounded-full px-2 py-1 text-high-emphasis text-xs font-medium mt-1 whitespace-nowrap ">
                                                {i18n._(t`Select a token`)}
                                            </div>
                                        )}
                                    </div>
                                    {!disableCurrencySelect && currency && <StyledDropDown selected={!!currency} />}
                                </div>
                            </div>
                        </div>
                    </CurrencySelect>
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
