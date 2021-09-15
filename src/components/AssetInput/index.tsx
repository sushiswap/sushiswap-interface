import Typography from '../../components/Typography'
import Lottie from 'lottie-react'
import selectCoinAnimation from '../../animation/select-coin.json'
import React, { FC, ReactNode, useState } from 'react'
import Button from '../../components/Button'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { classNames, maxAmountSpend, tryParseAmount } from '../../functions'
import { Currency, CurrencyAmount, Token } from '@sushiswap/sdk'
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
import Alert from '../Alert'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import Chip from '../Chip'

interface AssetInputProps {
  value: string
  currency: Currency
  onChange: (x: string) => void
  spendFromWallet?: boolean
  title?: string
  onSelect?: (x: Token) => void
  headerRight?: ReactNode
  chip?: string
  disabled?: boolean
  currencies?: Currency[]
}

// AssetInput exports its children so if you need a child component of this component,
// for example if you want this component without the title, take a look at the components this file exports
const AssetInput = ({ spendFromWallet = true, ...props }: AssetInputProps) => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const [open, setOpen] = useState(false)

  const bentoBalance = useBentoBalance2(account, spendFromWallet ? undefined : props.currency?.wrapped)
  const walletBalance = useCurrencyBalance(account, spendFromWallet ? props.currency : undefined)
  const balance = spendFromWallet ? walletBalance : bentoBalance
  const maxSpend = maxAmountSpend(balance)?.toExact()
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
    <div className="mt-4 flex flex-col gap-4">
      <div className="px-2 flex justify-between">
        {header}
        {props.headerRight && props.headerRight}
      </div>
      <AssetInputPanel
        {...props}
        error={error}
        spendFromWallet={spendFromWallet}
        onMax={() => props.onChange(maxSpend)}
        showMax={balance?.greaterThan('0') ? !parsedInput?.equalTo(maxAmountSpend(balance)) : false}
        footer={
          <AssetInputPanel.Balance
            balance={balance}
            onClick={() => props.onChange(maxSpend)}
            spendFromWallet={spendFromWallet}
          />
        }
      />
      {error && props.currency && (
        <Alert
          showIcon
          type="error"
          dismissable={false}
          title={i18n._(t`Insufficient ${props.currency.symbol} balance`)}
          message={i18n._(
            t`You do not have enough ${props.currency.symbol}. Please enter a value lower of equal than your balance to continue with your deposit.`
          )}
        />
      )}
    </div>
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
  error = false,
  currencies = [],
}: AssetInputPanelProps) => {
  const { i18n } = useLingui()
  const usdcValue = useUSDCValue(tryParseAmount(value, currency))

  let content = (
    <div className="flex flex-row gap-3 py-2.5 px-2">
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
      <div className="flex gap-3 py-4 px-3 items-center">
        <div>
          <CurrencyLogo currency={currency} size={48} className="rounded-full" />
        </div>
        <div className="flex flex-col flex-grow">
          <Typography variant="h3" weight={700}>
            <NumericalInput
              disabled={disabled}
              value={value}
              onUserInput={onChange}
              placeholder="0.00"
              className="bg-transparent flex flex-grow w-full"
            />
          </Typography>
          <Typography variant="sm" className={usdcValue ? 'text-green' : 'text-low-emphesis'}>
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
        error ? 'border-red border-opacity-20' : 'border-dark-700',
        'rounded bg-dark-900 flex flex-col overflow-hidden'
      )}
    >
      {content}
      {footer && footer}
    </div>
  )
}

interface AssetInputPanelBalanceProps {
  balance: CurrencyAmount<Currency>
  onClick: (x: CurrencyAmount<Currency>) => void
  spendFromWallet?: boolean
}

// This component seems to occur quite frequently which is why I gave it it's own component.
// It's a child of AssetInputPanel so only use together with an AssetInputPanel
const AssetInputPanelBalance: FC<AssetInputPanelBalanceProps> = ({ balance, onClick, spendFromWallet = true }) => {
  const { i18n } = useLingui()

  let icon = <WalletIcon className={classNames(balance ? 'text-high-emphesis' : 'text-low-emphesis')} />
  if (!spendFromWallet) {
    icon = <BentoBoxIcon className={classNames(balance ? 'text-high-emphesis' : 'text-low-emphesis')} />
  }

  return (
    <div className="flex justify-between bg-dark-800 py-2 px-3">
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
  const { i18n } = useLingui()

  return (
    <div className="flex gap-1.5 items-center">
      <div className="flex gap-3 items-center">
        <div className="flex flex-col">
          <Typography variant="xxs" weight={700} className="text-secondary text-right">
            {i18n._(t`Funding source:`)}
          </Typography>
          <Typography variant="sm" weight={700} className="text-high-emphesis text-right">
            {checked ? i18n._(t`Wallet`) : i18n._(t`BentoBox`)}
          </Typography>
        </div>
        <div>
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

      <BentoBoxFundingSourceModal />
    </div>
  )
}

AssetInputPanel.Balance = AssetInputPanelBalance
AssetInput.Panel = AssetInputPanel
AssetInput.WalletSwitch = AssetInputWalletSwitch

export default AssetInput
