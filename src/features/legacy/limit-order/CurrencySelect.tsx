import { ChevronDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency } from '@sushiswap/core-sdk'
import selectCoinAnimation from 'app/animation/select-coin.json'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { classNames } from 'app/functions'
import CurrencySearchModal from 'app/modals/SearchModal/CurrencySearchModal'
import Lottie from 'lottie-react'
import React, { FC, useCallback, useState } from 'react'

interface CurrencySelectProps {
  currency?: Currency
  otherCurrency?: Currency
  showCommonBases?: boolean
  onSelect: (x: Currency) => void
  disabled?: boolean
  label: string
  currencyList?: string[]
  includeNativeCurrency?: boolean
  allowManageTokenList?: boolean
}

const CurrencySelect: FC<CurrencySelectProps> = ({
  currency,
  otherCurrency,
  showCommonBases,
  onSelect,
  label,
  currencyList,
  disabled = false,
  includeNativeCurrency = true,
  allowManageTokenList = true,
}) => {
  const { i18n } = useLingui()
  const [modalOpen, setModalOpen] = useState(false)

  const handleClick = useCallback(() => {
    // @ts-ignore TYPE NEEDS FIXING
    if (onSelect) setModalOpen(true)
  }, [onSelect])

  return (
    <>
      <button
        type="button"
        className={classNames(
          !!currency ? 'text-primary' : 'text-high-emphesis',
          'open-currency-select-button h-full outline-none select-none cursor-pointer border-none text-xl font-medium items-center'
        )}
        onClick={handleClick}
      >
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
          <div className="flex flex-1 flex-col items-start justify-center mx-3.5">
            {label && <div className="text-xs font-medium text-secondary whitespace-nowrap">{label}</div>}
            <div className="flex items-center">
              <div className="text-lg font-bold token-symbol-container md:text-2xl">
                {(currency && currency.symbol && currency.symbol.length > 20
                  ? currency.symbol.slice(0, 4) +
                    '...' +
                    currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                  : currency?.symbol) || (
                  <div className="px-2 py-1 mt-1 text-xs font-medium bg-transparent border rounded-full hover:bg-primary border-low-emphesis text-secondary whitespace-nowrap ">
                    {i18n._(t`Select a token`)}
                  </div>
                )}
              </div>

              {!disabled && currency && <ChevronDownIcon width={16} height={16} className="ml-2 stroke-current" />}
            </div>
          </div>
        </div>
      </button>
      {!disabled && onSelect && (
        <CurrencySearchModal.Controlled
          open={modalOpen}
          onDismiss={() => setModalOpen(false)}
          onCurrencySelect={onSelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
          currencyList={currencyList}
          includeNativeCurrency={includeNativeCurrency}
          allowManageTokenList={allowManageTokenList}
          showSearch={true}
        />
      )}
    </>
  )
}

export default CurrencySelect
