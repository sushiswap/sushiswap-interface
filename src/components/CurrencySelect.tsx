import React from 'react'

interface CurrencySelectProps {
    selected: boolean
}

function CurrencySelect({
    selected = false,
    children,
    ...rest
}: CurrencySelectProps & React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element {
    return (
        <button {...rest} className="rounded bg-dark-700">
            {!selected && <>ICON</>}
        </button>
    )
}

export default CurrencySelect
