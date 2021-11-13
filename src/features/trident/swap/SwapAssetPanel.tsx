import { ChevronDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, Percent } from '@sushiswap/core-sdk'
import selectCoinAnimation from 'app/animation/select-coin.json'
import { BentoBoxIcon, WalletIcon } from 'app/components/AssetInput/icons'
import Button from 'app/components/Button'
import CurrencyLogo from 'app/components/CurrencyLogo'
import CurrencySelectDialog from 'app/components/CurrencySelectDialog'
import NumericalInput from 'app/components/Input/Numeric'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import Switch from 'app/components/Switch'
import Typography from 'app/components/Typography'
import { classNames, maxAmountSpend, tryParseAmount, warningSeverity } from 'app/functions'
import { useBentoOrWalletBalance } from 'app/hooks/useBentoOrWalletBalance'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import { useUSDCValue } from 'app/hooks/useUSDCPrice'
import { useActiveWeb3React } from 'app/services/web3'
import Lottie from 'lottie-react'
import React, { createContext, FC, useContext, useMemo, useState } from 'react'

import BentoBoxFundingSourceModal from '../add/BentoBoxFundingSourceModal'

type Context = Omit<SwapAssetPanel, 'header'>

const defaultContext: Context = {
  error: false,
  onChange: () => undefined,
  onSelect: () => undefined,
  spendFromWallet: true,
  currency: undefined,
  walletToggle: undefined,
  value: undefined,
  typedField: undefined,
  slippage: undefined,
  disabled: false,
}

const SwapAssetPanelContext = createContext<Context>(defaultContext)
const useSwapAssetPanelContext = () => useContext(SwapAssetPanelContext)

interface SwapAssetPanel {
  error: boolean
  header: React.ReactNode
  walletToggle: React.ReactNode
  currency?: Currency
  value?: string
  onChange?(x: string): void
  onSelect?(x: Currency): void
  spendFromWallet: boolean
  typedField?: boolean
  slippage?: Percent
  disabled?: boolean
}

const SwapAssetPanel = ({
  error,
  header,
  walletToggle,
  currency,
  value,
  onChange,
  typedField,
  onSelect,
  spendFromWallet,
  slippage,
  disabled,
}: SwapAssetPanel) => {
  const usdcValue = useUSDCValue(tryParseAmount(value, currency))

  return (
    <SwapAssetPanelContext.Provider
      value={useMemo(
        () => ({
          error,
          onChange,
          onSelect,
          spendFromWallet,
          currency,
          walletToggle,
          value,
          typedField,
          slippage,
          disabled,
        }),
        [error, currency, onChange, onSelect, spendFromWallet, typedField, value, walletToggle, slippage, disabled]
      )}
    >
      <div
        className={classNames(
          !disabled ? 'lg:shadow-lg' : '',
          typedField ? 'bg-dark-900 lg:bg-dark-1000' : 'bg-dark-900 lg:bg-dark-900',
          'lg:border lg:rounded-[14px] lg:border-dark-700 flex flex-col lg:p-5 py-3 lg:pb-3 gap-3 overflow-hidden'
        )}
      >
        {header}
        <div className="flex flex-col">
          <div
            className={classNames(
              typedField ? 'bg-dark-1000' : 'bg-dark-900',
              'block lg:hidden flex justify-between border border-dark-700 lg:border-none py-2 px-4 rounded-t lg:bg-transparent'
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
              typedField ? 'bg-dark-1000' : 'bg-dark-900',
              'border-l border-r border-dark-700 lg:border-none lg:bg-transparent'
            )}
          >
            <InputPanel />
          </div>
          <div className="hidden lg:block py-2 lg:pb-0 mt-3">
            <BalancePanel />
          </div>
          <div className="flex lg:hidden border border-dark-700 lg:border-none rounded-b overflow-hidden justify-between items-center">
            {walletToggle}
            {!disabled && (
              <div className="pr-5">
                <MaxButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </SwapAssetPanelContext.Provider>
  )
}

const WalletSwitch: FC<{ label: string; onChange(x: boolean): void }> = ({ label, onChange }) => {
  const { spendFromWallet } = useSwapAssetPanelContext()
  const { i18n } = useLingui()

  return (
    <div className="flex gap-2.5 items-center lg:px-0 px-4 py-3 lg:py-0 lg:bg-transparent bg-dark-900">
      <div className="flex flex-col order-2 lg:order-1">
        <Typography variant="xs" weight={700} className="text-secondary text-left lg:text-right">
          {label}
        </Typography>
        <Typography
          weight={700}
          className="text-high-emphesis text-right text-center flex gap-1 items-center justify-center"
        >
          {spendFromWallet ? i18n._(t`Wallet`) : i18n._(t`BentoBox`)} <BentoBoxFundingSourceModal />
        </Typography>
      </div>
      <div className="order-1 lg:order-2">
        <Switch
          checked={spendFromWallet}
          onChange={onChange}
          checkedIcon={
            <div className="text-dark-700 flex justify-center items-center h-full w-full">
              <WalletIcon />
            </div>
          }
          uncheckedIcon={
            <div className="text-dark-700 flex justify-center items-center h-full w-full">
              <BentoBoxIcon />
            </div>
          }
        />
      </div>
    </div>
  )
}

const InputPanel: FC = () => {
  const { i18n } = useLingui()
  const isDesktop = useDesktopMediaQuery()
  const [open, setOpen] = useState<boolean>(false)
  const { error, currency, value, onChange, disabled, onSelect, slippage } = useSwapAssetPanelContext()
  const usdcValue = useUSDCValue(tryParseAmount(value, currency))

  const slippageClassName = useMemo(() => {
    if (!slippage) return undefined
    if (slippage.lessThan('0')) return 'text-green'
    const severity = warningSeverity(slippage)
    if (severity < 1) return 'text-green'
    if (severity < 2) return 'text-secondary'
    if (severity < 3) return 'text-yellow'
    return 'text-red'
  }, [slippage])

  return (
    <div
      className={classNames(
        error ? 'border-red/50 lg:border-red/50' : ' border-transparent lg:border-dark-700',
        'border lg:rounded-full lg:bg-dark-900 flex items-center pl-4 lg:pl-0 px-[1px] py-1.5 lg:py-0 bg-transparent'
      )}
    >
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {currency ? (
          <CurrencyLogo currency={currency} className="rounded-full" size={isDesktop ? '74px' : '40px'} />
        ) : (
          <div className="flex items-center w-10 h-10 lg:w-[74px] lg:h-[74px] rounded-full relative">
            <Lottie animationData={selectCoinAnimation} autoplay loop />
          </div>
        )}
      </div>
      <div className="flex p-4 items-center flex-grow">
        <div className={classNames('flex lg:flex-col flex-grow')}>
          {currency && (
            <div className="block lg:hidden">
              <div
                className="flex gap-0.5 items-center cursor-pointer hover:text-high-emphesis"
                onClick={() => setOpen(true)}
              >
                <Typography variant={isDesktop ? 'h3' : 'base'} weight={700}>
                  {currency.symbol}
                </Typography>
                <ChevronDownIcon width={24} className="text-low-emphesis" />
              </div>
              <HeadlessUIModal.Controlled isOpen={open} onDismiss={() => setOpen(false)}>
                <CurrencySelectDialog currency={currency} onChange={onSelect} onDismiss={() => setOpen(false)} />
              </HeadlessUIModal.Controlled>
            </div>
          )}
          <Typography
            weight={700}
            variant={isDesktop ? 'h3' : 'lg'}
            className={classNames(
              !currency ? 'justify-start' : 'justify-between lg:justify-start',
              'w-full text-right lg:text-left items-center',
              value ? 'text-high-emphesis' : onChange ? 'text-primary' : 'text-secondary'
            )}
          >
            {!currency ? (
              <HeadlessUIModal
                trigger={
                  <div className="inline-flex items-center">
                    <Button
                      color="blue"
                      variant="filled"
                      className="rounded-full px-3 py-0 h-[32px] shadow-md"
                      endIcon={<ChevronDownIcon width={20} height={20} />}
                    >
                      <Typography variant="sm">{i18n._(t`Select a Token`)}</Typography>
                    </Button>
                  </div>
                }
              >
                {({ setOpen }) => (
                  <CurrencySelectDialog currency={currency} onChange={onSelect} onDismiss={() => setOpen(false)} />
                )}
              </HeadlessUIModal>
            ) : onChange ? (
              <NumericalInput
                disabled={disabled}
                value={value || ''}
                onUserInput={onChange}
                placeholder="0.00"
                className="bg-transparent text-inherit w-full flex-grow text-right lg:text-left disabled:cursor-not-allowed"
                autoFocus
              />
            ) : (
              value || '0.00'
            )}
          </Typography>
          <Typography variant="xs" className="text-secondary hidden lg:block text-left" weight={400}>
            {currency?.name}
          </Typography>
        </div>
        <div className="flex flex-col hidden lg:block">
          <Typography className="text-low-emphesis">≈${usdcValue?.toSignificant(3)}</Typography>
          {slippage && (
            <Typography variant="xs" weight={700} className={classNames(slippageClassName, 'text-right')}>
              {slippage.toSignificant(2)}%
            </Typography>
          )}
        </div>
      </div>
    </div>
  )
}

const BalancePanel: FC = () => {
  const { disabled, currency, onChange, spendFromWallet } = useSwapAssetPanelContext()
  const isDesktop = useDesktopMediaQuery()
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const balance = useBentoOrWalletBalance(account ? account : undefined, currency, spendFromWallet)

  let icon = <WalletIcon className={classNames(balance ? 'text-high-emphesis' : 'text-low-emphesis')} />
  if (!spendFromWallet) {
    icon = <BentoBoxIcon className={classNames(balance ? 'text-high-emphesis' : 'text-low-emphesis')} />
  }

  return (
    <div className="flex justify-between">
      <div className="flex gap-1 items-center">
        <div className="flex justify-between pr-1 flex items-center gap-1.5">
          <div className="hidden lg:block">{icon}</div>
          <Typography
            variant={isDesktop ? 'sm' : 'xs'}
            weight={700}
            className={classNames(balance ? 'text-primary' : 'text-low-emphesis')}
          >
            {spendFromWallet ? i18n._(t`Balance:`) : i18n._(t`Bento Balance:`)}
          </Typography>
        </div>
        <Typography
          variant={isDesktop ? 'sm' : 'xs'}
          weight={700}
          className={classNames(balance ? 'text-high-emphesis' : 'text-low-emphesis')}
          onClick={() => !disabled && balance && onChange && onChange(maxAmountSpend(balance).toExact())}
        >
          {balance ? balance.toSignificant(6) : '0.0000'}
        </Typography>
        <Typography variant="sm" weight={700} className="text-secondary hidden lg:block">
          {balance?.currency.symbol}
        </Typography>
      </div>
      {!disabled && (
        <Typography
          className="text-blue hidden lg:block"
          weight={700}
          variant="sm"
          onClick={() => balance && onChange && onChange(maxAmountSpend(balance).toExact())}
        >
          {i18n._(t`Use Max`)}
        </Typography>
      )}
    </div>
  )
}

const SwapAssetPanelHeader: FC<{ label: string }> = ({ label }) => {
  const isDesktop = useDesktopMediaQuery()
  const { currency, onSelect, walletToggle } = useSwapAssetPanelContext()

  return (
    <div className="flex justify-between items-center px-4 lg:px-0">
      <div className="flex flex-col gap-1">
        <Typography variant="xs" className="text-secondary" weight={700}>
          {label}
        </Typography>
        {currency && isDesktop && (
          <HeadlessUIModal
            trigger={
              <div className="flex gap-0.5 cursor-pointer hover:text-high-emphesis">
                <Typography variant="h3" weight={700}>
                  {currency.symbol}
                </Typography>
                <ChevronDownIcon width={24} className="text-low-emphesis" />
              </div>
            }
          >
            {({ setOpen }) => (
              <CurrencySelectDialog currency={currency} onChange={onSelect} onDismiss={() => setOpen(false)} />
            )}
          </HeadlessUIModal>
        )}
      </div>
      <div className="hidden lg:block">{walletToggle}</div>
      <div className="block lg:hidden">
        <BalancePanel />
      </div>
    </div>
  )
}

const MaxButton: FC = () => {
  const { i18n } = useLingui()
  const { currency, onChange, spendFromWallet } = useSwapAssetPanelContext()
  const { account } = useActiveWeb3React()
  const balance = useBentoOrWalletBalance(account ? account : undefined, currency, spendFromWallet)

  return (
    <div
      className="flex items-center justify-center h-9 w-[96px] rounded-full border border-blue/50 bg-blue/30 cursor-pointer"
      onClick={() => balance && onChange && onChange(maxAmountSpend(balance).toExact())}
    >
      <Typography variant="sm" className="text-blue" weight={700}>
        {i18n._(t`USE MAX`)}
      </Typography>
    </div>
  )
}

SwapAssetPanel.Header = SwapAssetPanelHeader
SwapAssetPanel.Switch = WalletSwitch

export default SwapAssetPanel
