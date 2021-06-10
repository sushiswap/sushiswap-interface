import React, { FC, useCallback } from 'react'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { LimitOrder } from 'limitorderv2-sdk'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { useDerivedSwapInfo } from '../../state/swap/hooks'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../state'
import { setLimitPrice } from '../../state/limit-order/actions'

interface LimitPriceInputPanelProps {
    placeholder: string
    value: string
    onBlur: () => void
}

const LimitPriceInputPanel: FC<LimitPriceInputPanelProps> = ({
    placeholder,
    value,
    onBlur,
}) => {
    const dispatch = useDispatch<AppDispatch>()
    const { currencies } = useDerivedSwapInfo()
    const { i18n } = useLingui()

    const handleInput = useCallback((value) => {
        dispatch(setLimitPrice(value))
        onBlur()
    }, [])

    return (
        <div className="flex bg-dark-800 w-full rounded overflow-hidden h-[68px] ">
            <div className="flex w-[220px] p-4 gap-4 items-center">
                <span className="font-bold text-secondary">
                    {i18n._(t`Rate`)}:
                </span>
                <span
                    className="uppercase border border-blue bg-blue text-blue bg-opacity-30 border-opacity-50 py-0.5 px-1.5 text-xs rounded-3xl flex items-center justify-center cursor-pointer hover:border-opacity-100"
                    onClick={() => handleInput(placeholder)}
                >
                    {i18n._(t`Current`)}
                </span>
            </div>
            <div className="flex bg-dark-900 pl-4 pr-5 w-full border-2 border-dark-800 rounded-r items-center gap-3">
                <NumericalInput
                    className="w-full bg-transparent font-medium text-2xl"
                    placeholder={placeholder}
                    id="token-amount-input"
                    value={value}
                    onUserInput={handleInput}
                    onBlur={onBlur}
                />
                <div className="text-xs text-secondary whitespace-nowrap">
                    {currencies.OUTPUT?.symbol} per {currencies.INPUT?.symbol}
                </div>
            </div>
        </div>
    )
}

export default LimitPriceInputPanel
