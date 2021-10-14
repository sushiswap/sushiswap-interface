import React, { FC } from 'react'
import { useCurrency } from '../../../hooks/Tokens'
import CurrencyLogo from '../../../components/CurrencyLogo'

const CurrencyLogoWrapper: FC<{ currencyId: string }> = ({ currencyId }) => {
  const currency = useCurrency(currencyId)
  return (
    <div className="-ml-2">
      <CurrencyLogo className="rounded-full" currency={currency} size={40} />
    </div>
  )
}

interface PoolCellProps {
  currencyIds: string[]
  symbols: string[]
}

export const PoolCell: FC<PoolCellProps> = ({ symbols, currencyIds }) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex ml-2">
          {currencyIds.map((id, i) => (
            <CurrencyLogoWrapper key={i} currencyId={id} />
          ))}
        </div>
        <div className="text-high-emphesis font-bold">{symbols.join('-')}</div>
      </div>
    </>
  )
}
