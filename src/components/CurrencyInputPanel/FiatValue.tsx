import { Currency, CurrencyAmount, Percent } from '@sushiswap/sdk'
import React, { useMemo } from 'react'

import { t } from '@lingui/macro'
import { warningSeverity } from '../../functions/prices'

export function FiatValue({
  fiatValue,
  priceImpact,
}: {
  fiatValue: CurrencyAmount<Currency> | null | undefined
  priceImpact?: Percent
}) {
  const priceImpactClassName = useMemo(() => {
    if (!priceImpact) return undefined
    if (priceImpact.lessThan('0')) return 'text-green'
    const severity = warningSeverity(priceImpact)
    if (severity < 1) return 'text-secondary'
    if (severity < 3) return 'text-yellow'
    return 'text-red'
  }, [priceImpact])

  return (
    <div className="flex justify-end space-x-1 text-xs font-medium text-right text-secondary">
      {fiatValue ? (
        <>
          ≈$ <div className="cursor-pointer">{fiatValue?.toSignificant(6, { groupSeparator: ',' })}</div>
        </>
      ) : (
        ''
      )}
      {priceImpact ? <span className={priceImpactClassName}>{priceImpact.multiply(-1).toSignificant(3)}%</span> : null}
    </div>
  )
}
