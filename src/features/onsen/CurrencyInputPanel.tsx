import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Percent, Token } from '@sushiswap/core-sdk'
import selectCoinAnimation from 'app/animation/select-coin.json'
import Button from 'app/components/Button'
import { FiatValue } from 'app/components/CurrencyInputPanel/FiatValue'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Input from 'app/components/Input'
import { classNames, formatCurrencyAmount } from 'app/functions'
import Lottie from 'lottie-react'
import React, { ReactNode } from 'react'

interface CurrencyInputPanelProps {
  value?: string
  onUserInput?: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  currencyBalance: CurrencyAmount<Currency> | null
  fiatValue?: CurrencyAmount<Token> | null
  currency?: Currency | null
  hideBalance?: boolean
  hideInput?: boolean
  hideIcon?: boolean
  priceImpact?: Percent
  id: string
  showCommonBases?: boolean
  renderBalance?: (amount: CurrencyAmount<Currency>) => ReactNode
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  currency,
  id,
  currencyBalance,
  fiatValue,
  priceImpact,
  hideBalance = false,
  hideInput = false,
  hideIcon = false,
}: CurrencyInputPanelProps) {
  const { i18n } = useLingui()

  return (
    <div id={id} className={classNames(hideInput ? 'p-2' : 'p-3', 'rounded bg-dark-900')}>
      <div className="flex space-x-3">
        {!hideIcon && (
          <div className="flex">
            {currency ? (
              <div className="flex items-center">
                <CurrencyLogo currency={currency} size={'54px'} />
              </div>
            ) : (
              <div className="rounded bg-dark-700" style={{ maxWidth: 54, maxHeight: 54 }}>
                <div style={{ width: 54, height: 54 }}>
                  <Lottie animationData={selectCoinAnimation} autoplay loop />
                </div>
              </div>
            )}
          </div>
        )}
        {!hideInput && (
          <div className={'flex flex-grow items-center w-full space-x-3 rounded focus:bg-dark-700 p-3 sm:w-3/5'}>
            <>
              {showMaxButton && currencyBalance && (
                <Button
                  onClick={onMax}
                  size="xs"
                  variant="outlined"
                  color="gray"
                  className="text-xs font-medium bg-transparent border !rounded-full hover:bg-primary border-low-emphesis !text-secondary whitespace-nowrap"
                >
                  {i18n._(t`Max`)}
                </Button>
              )}
              <Input.Numeric
                id="token-amount-input"
                value={value}
                onUserInput={(val) => {
                  onUserInput(val)
                }}
              />
              {!hideBalance && currency && currencyBalance ? (
                <div className="flex flex-col">
                  <div onClick={onMax} className="text-xs font-medium text-right cursor-pointer text-low-emphesis">
                    {formatCurrencyAmount(currencyBalance, 4)} {currency?.symbol}
                  </div>
                  <FiatValue fiatValue={fiatValue} priceImpact={priceImpact} />
                </div>
              ) : null}
            </>
          </div>
        )}
      </div>
    </div>
  )
}
