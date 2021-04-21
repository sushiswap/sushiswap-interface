import QuestionHelper from 'components/QuestionHelper'
import React from 'react'
import Settings from './Settings'

export type Color = 'pink' | 'blue'

const COLOR = {
    pink: 'checked:bg-pink checked:border-transparent focus:ring-pink',
    blue: 'checked:bg-blue checked:border-transparent focus:ring-blue'
}

export interface CheckboxProps {
    color: Color
    set: (value: boolean) => void
}

function Checkbox({
    color,
    set,
    className = '',
    ...rest
}: CheckboxProps & React.InputHTMLAttributes<HTMLInputElement>): JSX.Element {
    return (
        <input
            type="checkbox"
            onChange={event => set(event.target.checked)}
            className={`appearance-none h-5 w-5 rounded-sm bg-input border-dark-600 disabled:bg-dark-1000 disabled:border-dark-800 ${COLOR[color]} ${className}`}
            {...rest}
        />
    )
}

export function ExchangeRateCheckBox({ color, pair, updateOracle, setUpdateOracle, desiredDirection }: any) {
    const displayUpdateOracle = pair.currentExchangeRate.gt(0) ? updateOracle : true
    const show =
        displayUpdateOracle || desiredDirection === 'up'
            ? pair.oracleExchangeRate.lt(pair.currentExchangeRate)
            : pair.oracleExchangeRate.gt(pair.currentExchangeRate)

    return (
        displayUpdateOracle && (
            <div className="flex items-center mb-4">
                <Checkbox
                    color={color}
                    checked={displayUpdateOracle}
                    disabled={pair.currentExchangeRate.isZero()}
                    set={setUpdateOracle}
                />
                <span className="text-primary ml-2 mr-1">Update exchange rate from the oracle</span>
                <QuestionHelper
                    text={
                        pair.currentExchangeRate.gt(0)
                            ? 'The exchange rate from the oracle is only updated when needed. When the price in Kashi is different from the oracle, this may reduce the amount you can borrow. Updating the exchange rate from the oracle may increase your borrow limit.'
                            : 'The exchange rate has not been updated from the oracle yet in this market. If you borrow, it will be updated.'
                    }
                />
            </div>
        )
    )
}

export function SwapCheckbox({ title, color, swap, setSwap, help }: any) {
    return (
        <div className="flex items-center mb-4">
            <Checkbox color={color} checked={swap} set={setSwap} />
            <span className="text-primary ml-2 mr-1">{title}</span>
            <QuestionHelper text={help} />
            {swap && <Settings />}
        </div>
    )
}

export default Checkbox
