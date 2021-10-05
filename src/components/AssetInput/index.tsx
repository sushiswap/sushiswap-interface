import Typography from '../../components/Typography'
import Lottie from 'lottie-react'
import selectCoinAnimation from '../../animation/select-coin.json'
import React, { createContext, FC, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react'
import Button from '../../components/Button'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { classNames, maxAmountSpend, tryParseAmount } from '../../functions'
import { Currency, CurrencyAmount, Token } from '@sushiswap/core-sdk'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import CurrencyLogo from '../../components/CurrencyLogo'
import NumericalInput from '../../components/Input/Numeric'
import { useUSDCValue } from '../../hooks/useUSDCPrice'
import HeadlessUIModal from '../Modal/HeadlessUIModal'
import CurrencySelectDialog from '../CurrencySelectDialog'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'
import Switch from '../Switch'
import BentoBoxFundingSourceModal from '../../features/trident/add/BentoBoxFundingSourceModal'
import { BentoBoxIcon, WalletIcon } from './icons'
import { useBentoBalance2 } from '../../state/bentobox/hooks'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import Chip from '../Chip'
import useDesktopMediaQuery from '../../hooks/useDesktopMediaQuery'

interface AssetInputProps {
  value?: string
  currency?: Currency
  onChange: (x: string | undefined) => void
  spendFromWallet?: boolean
  title?: string
  onSelect?: (x: Token) => void
  headerRight?: ReactNode
  chip?: string
  disabled?: boolean
  currencies?: Currency[]
}

type AssetInput<P> = FC<P> & {
  WalletSwitch: FC<AssetInputWalletSwitchProps>
  Panel: FC<AssetInputPanelProps>
}

const AssetInputContext = createContext<boolean>(false)
const useAssetInputContextError = () => useContext(AssetInputContext)

// AssetInput exports its children so if you need a child component of this component,
// for example if you want this component without the title, take a look at the components this file exports
const AssetInput: AssetInput<AssetInputProps> = ({ spendFromWallet = true, ...props }) => {
  const isDesktop = useDesktopMediaQuery()
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const [open, setOpen] = useState(false)

  const bentoBalance = useBentoBalance2(
    account ? account : undefined,
    spendFromWallet ? undefined : props.currency?.wrapped
  )
  const walletBalance = useCurrencyBalance(account ? account : undefined, spendFromWallet ? props.currency : undefined)
  const balance = spendFromWallet ? walletBalance : bentoBalance
  const maxSpend = maxAmountSpend(balance)?.toExact()
  const maxSpendAsFraction = maxAmountSpend(balance)?.asFraction
  const parsedInput = tryParseAmount(props.value, props.currency)
  const error = balance ? parsedInput?.greaterThan(balance) : false

  let header = (
    <Typography variant="h3" weight={700} className="text-high-emphesis">
      {props.title ? props.title : i18n._(t`Choose an Asset`)}
    </Typography>
  )

  if (props.currency) {
    header = (
      <div className="flex gap-2.5 cursor-pointer items-center" onClick={() => setOpen(true)}>
        <div className="flex gap-0.5 items-center">
          <Typography variant="h3" weight={700} className="text-high-emphesis">
            {props.currency.symbol}
          </Typography>
          {props.onSelect && (
            <>
              <ChevronDownIcon width={24} height={24} className="text-secondary" />
              <HeadlessUIModal.Controlled isOpen={open} onDismiss={() => setOpen(false)}>
                <CurrencySelectDialog
                  currency={props.currency}
                  onChange={props.onSelect}
                  onDismiss={() => setOpen(false)}
                  currencies={props.currencies}
                />
              </HeadlessUIModal.Controlled>
            </>
          )}
        </div>
        {props.chip && <Chip color="white" label={props.chip} />}
      </div>
    )
  }

  return (
    <AssetInputContext.Provider value={useMemo(() => (error ? error : false), [error])}>
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-0">
          {!isDesktop && (
            <div className="px-2 flex justify-between">
              {header}
              {props.headerRight && props.headerRight}
            </div>
          )}
          <AssetInputPanel
            {...props}
            spendFromWallet={spendFromWallet}
            onMax={() => props.onChange(maxSpend)}
            showMax={
              balance && maxSpendAsFraction && balance.greaterThan('0')
                ? !parsedInput?.equalTo(maxSpendAsFraction)
                : false
            }
            footer={
              <AssetInputPanel.Balance
                balance={balance}
                onClick={() => props.onChange(maxSpend)}
                spendFromWallet={spendFromWallet}
              />
            }
          />
          {isDesktop && props.headerRight}
        </div>
      </div>
    </AssetInputContext.Provider>
  )
}

interface AssetInputPanelProps extends AssetInputProps {
  onMax: () => void
  footer?: ReactNode
  showMax?: boolean
  error?: boolean
}

const AssetInputPanel = ({
  value,
  currency,
  onChange,
  onSelect,
  onMax,
  footer,
  disabled,
  showMax = true,
  currencies = [],
}: AssetInputPanelProps) => {
  const error = useAssetInputContextError()
  const isDesktop = useDesktopMediaQuery()
  const { i18n } = useLingui()
  const usdcValue = useUSDCValue(tryParseAmount(value, currency))
  const span = useRef<HTMLSpanElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (isDesktop && span.current) setWidth(span?.current?.clientWidth + 6)
  }, [isDesktop, value])

  let content = (
    <div className="flex flex-row gap-3 py-2.5 px-2 flex-grow">
      <div className="w-12 h-12 rounded-full">
        <Lottie animationData={selectCoinAnimation} autoplay loop />
      </div>
      {onSelect && (
        <>
          <HeadlessUIModal
            trigger={({ setOpen }) => (
              <div className="inline-flex items-center">
                <Button
                  disabled={disabled}
                  color="blue"
                  variant="filled"
                  className="rounded-full px-3 py-0 h-[32px] shadow-md"
                  endIcon={<ChevronDownIcon width={24} height={24} />}
                  onClick={() => setOpen(true)}
                >
                  <Typography variant="sm">{i18n._(t`Select a Token`)}</Typography>
                </Button>
              </div>
            )}
          >
            {({ setOpen }) => (
              <CurrencySelectDialog
                currency={currency}
                onChange={onSelect}
                onDismiss={() => setOpen(false)}
                currencies={currencies}
              />
            )}
          </HeadlessUIModal>
        </>
      )}
    </div>
  )

  if (currency) {
    content = (
      <div
        className={classNames(
          error ? 'border-red border-opacity-40' : 'border-dark-700',
          'flex gap-3 py-4 px-3 items-center border-b'
        )}
      >
        <div>
          <CurrencyLogo currency={currency} size={48} className="rounded-full" />
        </div>
        <div className="flex flex-col flex-grow">
          <Typography variant="h3" weight={700} className="relative flex flex-row items-baseline">
            <NumericalInput
              disabled={disabled}
              value={value || ''}
              onUserInput={onChange}
              placeholder="0.00"
              className="bg-transparent"
              autoFocus
            />

            {isDesktop && (
              <span className="absolute pointer-events-none leading-7 text-low-emphesis" style={{ left: width }}>
                {currency?.symbol}
              </span>
            )}
          </Typography>
          <Typography variant="sm" className={error ? 'text-red' : usdcValue ? 'text-green' : 'text-low-emphesis'}>
            ≈${usdcValue ? usdcValue.toSignificant(6) : '0.00'}
          </Typography>
        </div>
        {error ? (
          <ExclamationCircleIcon className="text-red h-8 w-8 mr-2" />
        ) : (
          showMax && (
            <div
              onClick={() => onMax()}
              className="cursor-pointer flex flex-col items-center justify-center rounded-full overflow-hidden bg-blue bg-opacity-20 border border-blue text-blue px-3 h-9"
            >
              <Typography>MAX</Typography>
            </div>
          )
        )}
      </div>
    )
  }

  return (
    <div
      className={classNames(
        'border',
        error ? 'border-red border-opacity-40' : 'border-dark-700',
        'flex-1 rounded lg:rounded-l lg:rounded-r-[0px] bg-dark-900 flex flex-col overflow-hidden'
      )}
    >
      {/*This acts as a reference to get input width*/}
      <Typography variant="h3" weight={700} className="relative flex flex-row items-baseline">
        <span ref={span} className="opacity-0 absolute pointer-events-none tracking-[0]">
          {`${value ? value : '0.00'}`}
        </span>
      </Typography>
      {content}
      {footer && footer}
    </div>
  )
}

interface AssetInputPanelBalanceProps {
  balance: CurrencyAmount<Currency> | undefined
  onClick: (x: CurrencyAmount<Currency> | undefined) => void
  spendFromWallet?: boolean
}

// This component seems to occur quite frequently which is why I gave it it's own component.
// It's a child of AssetInputPanel so only use together with an AssetInputPanel
const AssetInputPanelBalance: FC<AssetInputPanelBalanceProps> = ({ balance, onClick, spendFromWallet = true }) => {
  const { i18n } = useLingui()
  const error = useAssetInputContextError()

  let icon = <WalletIcon className={classNames(balance ? 'text-high-emphesis' : 'text-low-emphesis')} />
  if (!spendFromWallet) {
    icon = <BentoBoxIcon className={classNames(balance ? 'text-high-emphesis' : 'text-low-emphesis')} />
  }

  return (
    <div className={classNames(error ? 'bg-red/10' : '', 'flex justify-between bg-dark-800 py-2 px-3')}>
      <div className="flex items-center gap-1.5">
        {icon}
        <Typography variant="sm" className={classNames(balance ? 'text-high-emphesis' : 'text-low-emphesis')}>
          {i18n._(t`Balance:`)}
        </Typography>
      </div>
      <Typography
        variant="sm"
        weight={700}
        className={classNames(balance ? 'text-high-emphesis' : 'text-low-emphesis')}
        onClick={() => onClick(balance)}
      >
        {balance ? `${balance.toSignificant(6)} ${balance.currency.symbol}` : '0.0000'}
      </Typography>
    </div>
  )
}

interface AssetInputWalletSwitchProps {
  checked: boolean
  onChange: (x: boolean) => void
}

const AssetInputWalletSwitch: FC<AssetInputWalletSwitchProps> = ({ checked, onChange }) => {
  const error = useAssetInputContextError()

  const isDesktop = useDesktopMediaQuery()
  const { i18n } = useLingui()

  const helper = <BentoBoxFundingSourceModal />

  return (
    <div
      className={classNames(
        error ? 'lg:border-red/40' : 'lg:border-dark-700',
        'lg:p-4 flex gap-1.5 items-center lg:border-r lg:border-t lg:border-b lg:bg-dark-900 lg:rounded-r lg:justify-center lg:min-w-[120px]'
      )}
    >
      <div className="flex gap-3 items-center lg:flex-col">
        <div className="flex flex-col order-1 lg:order-2">
          <Typography variant="xxs" weight={700} className="text-secondary text-right lg:text-center">
            {i18n._(t`Funding source:`)}
          </Typography>
          <Typography
            variant="sm"
            weight={700}
            className="text-high-emphesis text-right lg:text-center lg:flex lg:gap-1 lg:items-center lg:justify-center"
          >
            {checked ? i18n._(t`Wallet`) : i18n._(t`BentoBox`)} {isDesktop && helper}
          </Typography>
        </div>
        <div className="order-2 lg:order-1">
          <Switch
            checked={checked}
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

      {!isDesktop && helper}
    </div>
  )
}

AssetInputPanel.Balance = AssetInputPanelBalance
AssetInput.Panel = AssetInputPanel
AssetInput.WalletSwitch = AssetInputWalletSwitch

export default AssetInput
