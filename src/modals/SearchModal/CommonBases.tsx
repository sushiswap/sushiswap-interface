import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import QuestionHelper from 'app/components/QuestionHelper'
import Typography from 'app/components/Typography'
import { COMMON_BASES } from 'app/config/routing'
import { currencyId } from 'app/functions'
import React from 'react'

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency,
}: {
  chainId?: number
  selectedCurrency?: Currency | null
  onSelect: (currency: Currency) => void
}) {
  const { i18n } = useLingui()
  const bases = typeof chainId !== 'undefined' ? COMMON_BASES[chainId] ?? [] : []

  if (bases.length === 0) return <></>

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row">
        <Typography variant="xs" weight={700} className="text-low-emphesis flex items-center">
          {i18n._(t`Common bases`)}
          <QuestionHelper text="These tokens are commonly paired with other tokens." />
        </Typography>
      </div>
      <div className="flex flex-wrap gap-2">
        {bases.map((currency: Currency) => {
          const isSelected = selectedCurrency?.equals(currency)
          return (
            <Button
              variant="empty"
              type="button"
              onClick={() => !isSelected && onSelect(currency)}
              disabled={isSelected}
              key={currencyId(currency)}
              className="border border-dark-700 disabled:bg-dark-700 flex items-center p-2 space-x-2 rounded bg-dark-700/20 hover:bg-dark-700/60 disabled:bg-dark-1000 disabled:cursor-not-allowed"
            >
              <CurrencyLogo currency={currency} />
              <Typography variant="sm" className="font-semibold">
                {currency.symbol}
              </Typography>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
