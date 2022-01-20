import { ChevronDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, Percent } from '@sushiswap/core-sdk'
import selectCoinAnimation from 'app/animation/select-coin.json'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { BentoboxIcon, WalletIcon } from 'app/components/Icon'
import NumericalInput from 'app/components/Input/Numeric'
import QuestionHelper from 'app/components/QuestionHelper'
import Switch from 'app/components/Switch'
import Typography from 'app/components/Typography'
import { classNames, maxAmountSpend, tryParseAmount, warningSeverity } from 'app/functions'
import { useBentoOrWalletBalance } from 'app/hooks/useBentoOrWalletBalance'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import { useUSDCValue } from 'app/hooks/useUSDCPrice'
import CurrencySearchModal from 'app/modals/SearchModal/CurrencySearchModal'
import { useActiveWeb3React } from 'app/services/web3'
import Lottie from 'lottie-react'
import React, { FC, useCallback, useMemo, useState } from 'react'

import BentoBoxFundingSourceModal from '../add/BentoBoxFundingSourceModal'

interface SwapAssetPanel {
  error: boolean
  header: (x) => React.ReactNode
  walletToggle: (x) => React.ReactNode
  currency?: Currency
  currencies?: string[]
  value?: string
  onChange(x?: string): void
  onSelect?(x: Currency): void
  spendFromWallet: boolean
  selected?: boolean
  priceImpact?: Percent
  disabled?: boolean
}

const SwapAssetPanel = ({
  error,
  header,
  walletToggle,
  currency,
  value,
  onChange,
  selected,
  onSelect,
  spendFromWallet,
  priceImpact,
  disabled,
  currencies,
}: SwapAssetPanel) => {
  const usdcValue = useUSDCValue(tryParseAmount(value || '1', currency))

  return (
    <div
      className={classNames(
        selected ? 'lg:bg-dark-800 lg:border-dark-700' : 'bg-dark-900 lg:border-dark-800',
        'lg:border lg:rounded-[14px] flex flex-col lg:p-5 py-3 lg:pb-3 gap-3 overflow-hidden'
      )}
    >
      {header({
        disabled,
        onChange,
        value,
        currency,
        onSelect,
        walletToggle,
        spendFromWallet,
      })}
      <div className="flex flex-col">
        <div
          className={classNames(
            selected ? 'bg-dark-800 border-dark-700' : 'bg-dark-900 border-dark-800',
            'block lg:hidden flex justify-between border lg:border-none py-2 px-4 rounded-t lg:bg-transparent'
          )}
        >
          <Typography variant="xs" weight={700}>
            {currency?.name}
          </Typography>
          <Typography variant="xs" weight={700}>
            ≈${usdcValue?.toSignificant(3)}
          </Typography>
        </div>
        <div
          className={classNames(
            selected ? 'bg-dark-800 border-dark-700' : 'border-dark-800',
            'border-l border-r lg:border-none lg:bg-transparent'
          )}
        >
          <InputPanel
            {...{
              selected,
              error,
              currency,
              currencies,
              value,
              onChange,
              disabled,
              onSelect,
              priceImpact,
              spendFromWallet,
            }}
          />
        </div>
        <div className="hidden py-2 mt-1 lg:block lg:pb-0">
          <BalancePanel {...{ disabled, currency, onChange, spendFromWallet }} />
        </div>
        <div
          className={classNames(
            selected ? 'bg-dark-800' : '',
            'flex items-center justify-between overflow-hidden border rounded-b lg:hidden border-dark-700 lg:border-none'
          )}
        >
          {walletToggle({ spendFromWallet })}
        </div>
      </div>
    </div>
  )
}

const WalletSwitch: FC<
  Pick<SwapAssetPanel, 'spendFromWallet' | 'disabled'> & {
    label: string
    onChange(x: boolean): void
    id?: string
  }
> = ({ label, onChange, id, spendFromWallet, disabled }) => {
  const { i18n } = useLingui()

  const content = (
    <div
      className={classNames(
        disabled ? 'opacity-40' : '',
        'flex gap-2.5 items-center !justify-start lg:px-0 px-4 py-3 lg:py-0'
      )}
    >
      <div className="flex flex-col order-2 lg:order-1">
        <Typography variant="xs" weight={700} className="text-left text-secondary lg:text-right">
          {label}
        </Typography>
        <Typography
          weight={700}
          className="flex items-center justify-center gap-1 text-center text-right text-high-emphesis"
        >
          {spendFromWallet ? i18n._(t`Wallet`) : i18n._(t`BentoBox`)} <BentoBoxFundingSourceModal />
        </Typography>
      </div>
      <div className={classNames(disabled ? 'pointer-events-none' : '', 'order-1 lg:order-2')}>
        <Switch
          id={id}
          checked={spendFromWallet}
          onChange={onChange}
          checkedIcon={
            <div className="flex items-center justify-center w-full h-full text-dark-700">
              <WalletIcon width={16} height={14} />
            </div>
          }
          uncheckedIcon={
            <div className="flex items-center justify-center w-full h-full text-dark-700">
              <BentoboxIcon width={16} height={16} />
            </div>
          }
        />
      </div>
    </div>
  )

  if (disabled) {
    return <QuestionHelper text={i18n._(t`Not available for legacy route`)}>{content}</QuestionHelper>
  }

  return content
}

const InputPanel: FC<
  Pick<
    SwapAssetPanel,
    | 'error'
    | 'currency'
    | 'value'
    | 'onChange'
    | 'disabled'
    | 'onSelect'
    | 'priceImpact'
    | 'spendFromWallet'
    | 'selected'
    | 'currencies'
  >
> = ({ error, currency, currencies, value, onChange, disabled, onSelect, priceImpact, selected, spendFromWallet }) => {
  const { i18n } = useLingui()
  const isDesktop = useDesktopMediaQuery()
  const [open, setOpen] = useState<boolean>(false)
  const usdcValue = useUSDCValue(tryParseAmount(value || '1', currency))

  const priceImpactClassName = useMemo(() => {
    if (!priceImpact) return undefined
    if (priceImpact.lessThan('0')) return 'text-green'
    const severity = warningSeverity(priceImpact)
    if (severity < 1) return 'text-green'
    if (severity < 2) return 'text-yellow'
    if (severity < 3) return 'text-red'
    return 'text-red'
  }, [priceImpact])

  return (
    <div
      className={classNames(
        selected ? 'lg:border-dark-700' : 'lg:border-dark-800',
        error ? 'border-red/50 lg:border-red/50' : 'border-transparent',
        'border lg:rounded-full lg:bg-dark-900 flex items-center pl-4 lg:pl-0 px-[1px] py-1.5 lg:py-0 bg-transparent'
      )}
    >
      <div className="cursor-pointer lg:pl-3" onClick={() => setOpen(true)}>
        {currency ? (
          <CurrencyLogo currency={currency} className="!rounded-full overflow-hidden" size={40} />
        ) : (
          <div className="flex items-center w-10 h-10 lg:w-[74px] lg:h-[74px] rounded-full relative">
            <Lottie animationData={selectCoinAnimation} autoplay loop />
          </div>
        )}
      </div>
      <div className="flex items-center flex-grow p-4">
        <div className={classNames('flex lg:flex-col flex-grow')}>
          {currency && (
            <div className="block lg:hidden">
              <div
                className="flex gap-0.5 items-center cursor-pointer hover:text-high-emphesis"
                onClick={() => setOpen(true)}
              >
                <Typography variant={isDesktop ? 'h3' : 'base'} weight={700}>
                  {!spendFromWallet ? currency.wrapped.symbol : currency.symbol}
                </Typography>
                <ChevronDownIcon width={24} className="text-low-emphesis" />
              </div>
              <CurrencySearchModal.Controlled
                open={open}
                selectedCurrency={currency}
                onCurrencySelect={(currency) => onSelect && onSelect(currency)}
                onDismiss={() => setOpen(false)}
                {...(currencies && { currencyList: currencies })}
              />
            </div>
          )}
          <Typography
            weight={700}
            variant={isDesktop ? 'h3' : 'lg'}
            className={classNames(
              !currency ? 'justify-start' : 'justify-between lg:justify-start',
              'w-full text-right lg:text-left items-center swap-panel-input',
              value ? 'text-high-emphesis' : 'text-primary'
            )}
          >
            {!currency ? (
              <CurrencySearchModal
                selectedCurrency={currency}
                {...(currencies?.length > 0 && { currencyList: currencies })}
                onCurrencySelect={(currency) => onSelect && onSelect(currency)}
                trigger={
                  <div className="inline-flex items-center">
                    <Button
                      color="blue"
                      variant="filled"
                      className="!rounded-full px-3 py-0 h-[32px] shadow-md token-select-trigger"
                      endIcon={<ChevronDownIcon width={20} height={20} />}
                    >
                      <Typography variant="sm">{i18n._(t`Select a Token`)}</Typography>
                    </Button>
                  </div>
                }
              />
            ) : (
              <NumericalInput
                disabled={disabled}
                value={value || ''}
                onUserInput={onChange}
                placeholder="0.00"
                className="flex-grow w-full text-right bg-transparent text-inherit lg:text-left disabled:cursor-not-allowed"
                autoFocus
              />
            )}
          </Typography>
        </div>
        <div className="flex flex-col hidden lg:block">
          <Typography className="text-low-emphesis" variant="sm">
            ≈${usdcValue?.toFixed(2)}
          </Typography>
          {priceImpact && (
            <Typography variant="xs" weight={700} className={classNames(priceImpactClassName, 'text-right')}>
              {priceImpact.toSignificant(3)}%
            </Typography>
          )}
        </div>
      </div>
    </div>
  )
}

const BalancePanel: FC<Pick<SwapAssetPanel, 'disabled' | 'currency' | 'onChange' | 'spendFromWallet'>> = ({
  disabled,
  currency,
  onChange,
  spendFromWallet,
}) => {
  const isDesktop = useDesktopMediaQuery()
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const balance = useBentoOrWalletBalance(account ? account : undefined, currency, spendFromWallet)

  const handleClick = useCallback(() => {
    if (disabled || !balance || !onChange) return
    onChange(maxAmountSpend(balance)?.toExact())
  }, [balance, disabled, onChange])

  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1">
        <Typography variant={isDesktop ? 'sm' : 'xs'} weight={700} className="text-secondary">
          {i18n._(t`Balance:`)}
        </Typography>
        <Typography
          id={currency ? `text-balance-${currency?.symbol}` : ''}
          variant={isDesktop ? 'sm' : 'xs'}
          weight={700}
          onClick={handleClick}
          className="text-secondary"
        >
          {balance ? balance.toSignificant(6) : '0.0000'}
        </Typography>
      </div>
    </div>
  )
}

const SwapAssetPanelHeader: FC<
  Pick<
    SwapAssetPanel,
    'currency' | 'onSelect' | 'walletToggle' | 'spendFromWallet' | 'disabled' | 'onChange' | 'value'
  > & { label: string; id?: string }
> = ({ disabled, onChange, value, currency, onSelect, walletToggle, spendFromWallet, label, id }) => {
  const isDesktop = useDesktopMediaQuery()

  return (
    <div className="flex items-center justify-between px-4 lg:px-0">
      <div className="flex flex-col gap-1">
        <Typography variant="xs" className="text-secondary" weight={700}>
          {label}
        </Typography>
        {currency && isDesktop && (
          <CurrencySearchModal
            selectedCurrency={currency}
            onCurrencySelect={(currency) => onSelect && onSelect(currency)}
            trigger={
              <div id={id} className="flex gap-0.5 cursor-pointer hover:text-high-emphesis">
                <Typography variant="h3" weight={700}>
                  {!spendFromWallet ? currency.wrapped.symbol : currency.symbol}
                </Typography>
                <ChevronDownIcon width={24} className="text-low-emphesis" />
              </div>
            }
          />
        )}
      </div>
      <div className="hidden lg:block">{walletToggle({ spendFromWallet })}</div>
      <div className="block lg:hidden">
        <BalancePanel {...{ disabled, currency, onChange, spendFromWallet, value }} />
      </div>
    </div>
  )
}

SwapAssetPanel.Header = SwapAssetPanelHeader
SwapAssetPanel.Switch = WalletSwitch

export default SwapAssetPanel
