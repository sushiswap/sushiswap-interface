import Typography from '../../components/Typography'
import Lottie from 'lottie-react'
import selectCoinAnimation from '../../animation/select-coin.json'
import React, { FC, ReactNode, useState } from 'react'
import Button from '../../components/Button'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { classNames, tryParseAmount } from '../../functions'
import { CurrencyAmount, Token } from '@sushiswap/sdk'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import CurrencyLogo from '../../components/CurrencyLogo'
import NumericalInput from '../../components/NumericalInput'
import { useUSDCValue } from '../../hooks/useUSDCPrice'
import HeadlessUIModal from '../Modal/HeadlessUIModal'
import CurrencySelectDialog from '../CurrencySelectDialog'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'

interface AssetInputProps {
  value: string
  currency: Token
  onMax: () => void
  onChange: (x: string) => void
  onSelect?: (x: Token) => void
  showMax?: boolean
}

// AssetInput exports its children so if you need a child component of this component,
// for example if you want this component without the title, take a look at the components this file exports
const AssetInput = (props: AssetInputProps) => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const balance = useTokenBalance(account, props.currency)
  const [open, setOpen] = useState(false)

  let title = (
    <Typography variant="h3" weight={700} className="text-high-emphesis">
      {i18n._(t`Choose an Asset`)}
    </Typography>
  )

  if (props.currency) {
    title = (
      <div className="flex gap-0.5 cursor-pointer items-center" onClick={() => setOpen(true)}>
        <Typography variant="h3" weight={700} className="text-high-emphesis">
          {props.currency.symbol}
        </Typography>
        {props.onSelect && (
          <>
            <ChevronDownIcon width={24} height={24} className="text-secondary" />
            {/*This is a bit nasty, have to define this modal twice as AssetInputPanel uses this as well.
               I want both components completely decoupled so I feel like there's no other way*/}
            <HeadlessUIModal isOpen={open} onDismiss={() => setOpen(false)}>
              <CurrencySelectDialog
                currency={props.currency}
                onChange={props.onSelect}
                onDismiss={() => setOpen(false)}
              />
            </HeadlessUIModal>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      {title}
      <AssetInputPanel {...props} footer={<AssetInputPanel.Balance balance={balance} onClick={props.onMax} />} />
    </div>
  )
}

interface AssetInputPanelProps extends AssetInputProps {
  footer?: ReactNode
}

const AssetInputPanel = ({
  value,
  currency,
  onChange,
  onSelect,
  onMax,
  footer,
  showMax = true,
}: AssetInputPanelProps) => {
  const { i18n } = useLingui()
  const usdcValue = useUSDCValue(tryParseAmount(value, currency))
  const [open, setOpen] = useState(false)

  let content = (
    <div className="flex flex-row gap-3 py-2.5 px-2">
      <div className="w-12 h-12 rounded-full">
        <Lottie animationData={selectCoinAnimation} autoplay loop />
      </div>
      {onSelect && (
        <>
          <div className="inline-flex items-center">
            <Button
              color="blue"
              variant="filled"
              className="rounded-full px-3 py-0 h-[32px] shadow-md"
              endIcon={<ChevronDownIcon width={24} height={24} />}
              onClick={() => setOpen(true)}
            >
              <Typography variant="sm">{i18n._(t`Select a Token`)}</Typography>
            </Button>
          </div>
          <HeadlessUIModal isOpen={open} onDismiss={() => setOpen(false)}>
            <CurrencySelectDialog currency={currency} onChange={onSelect} onDismiss={() => setOpen(false)} />
          </HeadlessUIModal>
        </>
      )}
    </div>
  )

  if (currency) {
    content = (
      <div className="flex gap-3 py-4 px-3 items-center">
        <div>
          <div className="rounded-full overflow-hidden">
            <CurrencyLogo currency={currency} size={48} />
          </div>
        </div>
        <div className="flex flex-col flex-grow">
          <Typography variant="h3" weight={700}>
            <NumericalInput
              value={value}
              onUserInput={onChange}
              placeholder="0.00"
              className="bg-transparent flex flex-grow w-full"
            />
          </Typography>
          <Typography variant="sm" className="text-low-emphesis">
            ≈${usdcValue ? usdcValue.toSignificant(6) : '0.00'}
          </Typography>
        </div>
        {showMax && (
          <div
            onClick={() => onMax()}
            className="cursor-pointer flex flex-col items-center justify-center rounded-full overflow-hidden bg-blue bg-opacity-20 border border-blue text-blue px-3 h-9"
          >
            <Typography>MAX</Typography>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={classNames(
        showMax ? 'border' : 'border-2',
        'rounded border-dark-700 bg-dark-900 flex flex-col overflow-hidden'
      )}
    >
      {content}
      {footer && footer}
    </div>
  )
}

interface AssetInputPanelBalanceProps {
  balance: CurrencyAmount<Token>
  onClick: () => void
}

// This component seems to occur quite frequently which is why I gave it it's own component.
// It's a child of AssetInputPanel so only use together with an AssetInputPanel
const AssetInputPanelBalance: FC<AssetInputPanelBalanceProps> = ({ balance, onClick }) => {
  const { i18n } = useLingui()
  return (
    <div className="flex justify-between bg-dark-800 py-2 px-3">
      <div className="flex items-center gap-1.5">
        <svg
          className={classNames(balance ? 'text-high-emphesis' : 'text-low-emphesis')}
          width="16"
          height="13"
          viewBox="0 0 16 13"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.9521 12.5362H0.97363C0.436511 12.5362 0 12.0724 0 11.5017V1.03448C0 0.463793 0.436511 0 0.97363 0H13.9521C14.4893 0 14.9257 0.463793 14.9257 1.03448V3.36897H10.2669C9.91804 3.36897 9.57727 3.4431 9.2576 3.58621C8.94928 3.72414 8.67181 3.92414 8.43488 4.17586C8.19798 4.42759 8.00973 4.72241 7.87991 5.05C7.7436 5.38966 7.67545 5.75172 7.67545 6.12241V6.41379C7.67545 6.78448 7.74522 7.14655 7.87991 7.48621C8.00973 7.81379 8.19796 8.10864 8.43488 8.36036C8.6718 8.61207 8.94928 8.81207 9.2576 8.95C9.57727 9.09484 9.91804 9.16724 10.2669 9.16724H14.9257V11.5017C14.9257 12.0724 14.4893 12.5362 13.9521 12.5362ZM15.2698 4.40332C15.6738 4.40332 16 4.74987 16 5.17918V7.35675C16 7.78606 15.6738 8.13261 15.2698 8.13261H14.9258H10.2669C9.37282 8.13261 8.64909 7.36367 8.64909 6.41367V6.12229C8.64909 5.17229 9.37281 4.40332 10.2669 4.40332H14.9258H15.2698ZM9.6714 6.26711C9.6714 6.7723 10.056 7.18091 10.5314 7.18091C11.0069 7.18091 11.3915 6.7723 11.3915 6.26711C11.3915 5.76194 11.0069 5.35332 10.5314 5.35332C10.056 5.35332 9.6714 5.76194 9.6714 6.26711Z"
            fill="currentColor"
          />
        </svg>
        <Typography variant="sm" className={classNames(balance ? 'text-high-emphesis' : 'text-low-emphesis')}>
          {i18n._(t`Balance:`)}
        </Typography>
      </div>
      <Typography
        variant="sm"
        weight={700}
        className={classNames(balance ? 'text-high-emphesis' : 'text-low-emphesis')}
        onClick={() => onClick()}
      >
        {balance ? `${balance.toSignificant(6)} ${balance.currency.symbol}` : '0.0000'}
      </Typography>
    </div>
  )
}

AssetInputPanel.Balance = AssetInputPanelBalance
AssetInput.Panel = AssetInputPanel

export default AssetInput
