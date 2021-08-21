import { Currency, Percent, Price } from '@sushiswap/sdk'

import { Field } from '../../../state/mint/actions'
import { ONE_BIPS } from '../../../constants'
import React from 'react'
import Typography from '../../../components/Typography'
import { classNames } from '../../../functions'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export default function LiquidityPrice({
  currencies,
  price,
  noLiquidity,
  poolTokenPercentage,
  className,
}: {
  currencies: { [field in Field]?: Currency }
  price?: Price<Currency, Currency>
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  className?: string
}): JSX.Element {
  const { i18n } = useLingui()
  return (
    <div className={classNames('flex justify-between items-center rounded py-2 px-4 bg-dark-900', className)}>
      <div className="flex flex-col w-full text-secondary">
        <Typography variant="sm" className="select-none">
          {i18n._(
            t`${price?.toSignificant(6) ?? '-'} ${currencies[Field.CURRENCY_B]?.symbol} per ${
              currencies[Field.CURRENCY_A]?.symbol
            }`
          )}
        </Typography>
        <Typography variant="sm" className="select-none">
          {i18n._(
            t`${price?.invert()?.toSignificant(6) ?? '-'} ${currencies[Field.CURRENCY_A]?.symbol} per ${
              currencies[Field.CURRENCY_B]?.symbol
            }`
          )}
        </Typography>
      </div>

      <div className="flex flex-col w-full text-right text-secondary">
        <Typography variant="sm" className="select-none">
          {noLiquidity && price
            ? '100'
            : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
          %
        </Typography>
        <Typography variant="sm" className="select-none">
          {i18n._(t`Share of Pool`)}
        </Typography>
      </div>
    </div>
  )
}
