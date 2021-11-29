import { ArrowDownIcon, XIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ZERO } from '@sushiswap/core-sdk'
import loadingCircle from 'app/animation/loading-circle.json'
import AssetInput from 'app/components/AssetInput'
import Button from 'app/components/Button'
import Dots from 'app/components/Dots'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { SelectedCurrencyAtom } from 'app/features/trident/balances/context/atoms'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { tryParseAmount } from 'app/functions'
import { useBentoBox, useBentoBoxContract } from 'app/hooks'
import { useBentoBalances } from 'app/hooks/useBentoOrWalletBalance'
import { useActiveWeb3React } from 'app/services/web3'
import { useCurrencyBalance } from 'app/state/wallet/hooks'
import Lottie from 'lottie-react'
import React, { FC, useCallback, useState } from 'react'
import { useRecoilValue } from 'recoil'

interface DepositToBentoBoxModalProps {
  open: boolean
  onClose(): void
}

const DepositToBentoBoxModal: FC<DepositToBentoBoxModalProps> = ({ open, onClose }) => {
  const { account } = useActiveWeb3React()
  const currency = useRecoilValue(SelectedCurrencyAtom)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const walletBalance = useCurrencyBalance(account ?? undefined, currency)
  const [bentoBalance] = useBentoBalances(currency ? [currency.wrapped] : undefined)
  const { deposit } = useBentoBox()
  const [value, setValue] = useState<string>()
  const { i18n } = useLingui()
  const bentoboxContract = useBentoBoxContract()

  let _value = currency ? tryParseAmount(value, currency) : undefined
  let valuePlusBalance = _value?.wrapped
  if (valuePlusBalance && bentoBalance) valuePlusBalance = valuePlusBalance.add(bentoBalance)

  const execute = useCallback(async () => {
    if (!currency || !value) return

    try {
      setAttemptingTxn(true)
      await deposit(currency?.wrapped.address, value.toBigNumber(currency?.decimals))
    } finally {
      setAttemptingTxn(false)
      onClose()
    }
  }, [currency, deposit, onClose, value])

  let error = !account
    ? i18n._(t`Connect Wallet`)
    : !_value?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : !walletBalance
    ? i18n._(t`Loading balance`)
    : _value?.greaterThan(walletBalance)
    ? i18n._(t`Insufficient ${_value.currency.symbol} balance`)
    : ''

  return (
    <HeadlessUiModal.Controlled isOpen={open} onDismiss={onClose} className="!bg-dark-800 lg:!bg-transparent">
      <div className="lg:max-w-[28rem] lg:min-w-[28rem]">
        <div className="flex flex-col bg-dark-900 p-5 gap-5">
          <div className="flex flex-col gap-5">
            <div className="flex justify-between">
              <Typography variant="h2" className="text-high-emphesis" weight={700}>
                {i18n._(t`Deposit to`)}
                <br />
                {i18n._(t`BentoBox`)}
              </Typography>
              <div className="w-8 h-8 cursor-pointer" onClick={onClose}>
                <XIcon width={30} />
              </div>
            </div>
            <AssetInput
              title={''}
              currency={currency}
              onChange={(val) => setValue(val)}
              value={value}
              spendFromWallet={true}
            />
          </div>
          <div className="p-2 relative">
            <div className="absolute inline-flex items-center justify-center rounded-full p-3 bg-dark-800 border-2 border-dark-900">
              <ArrowDownIcon width={30} className="text-high-emphesis" />
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-dark-800 p-5 gap-5">
          <div className="h-4" />
          <div className="flex border border-dark-700 rounded p-3 bg-dark-900 gap-2.5">
            <div className="border border-dark-700 rounded-full p-3 shadow-md">
              <svg width="20" height="20" viewBox="0 0 42 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M41.2889 30.3349L39.2614 1.09591C39.2232 0.533741 38.7295 0.111781 38.1797 0.149292C37.6465 0.187037 37.2385 0.632858 37.2367 1.1625C37.2343 0.601106 36.7719 0.146973 36.2024 0.146973C35.6314 0.146973 35.168 0.603511 35.168 1.16696V30.406C35.168 30.9694 35.6314 31.426 36.2024 31.426C36.7734 31.426 37.2367 30.9694 37.2367 30.406V1.17169C37.2369 1.19366 37.2377 1.21577 37.2392 1.23801L39.2667 30.477C39.3037 31.0149 39.7492 31.426 40.2765 31.426C40.8692 31.4259 41.3296 30.922 41.2889 30.3349ZM11.9733 0.146973H27.1704C29.4558 0.146973 31.315 2.00617 31.3149 4.29161V17.6465H20.2626V13.5019C20.2626 11.2164 18.4034 9.35723 16.1179 9.35723H11.9733V0.146973ZM16.1179 12.1205H11.9733V17.6467H17.4995V13.5021C17.4995 12.7403 16.8797 12.1205 16.1179 12.1205ZM0 27.3174V20.4097H14.7365V31.462H4.14463C1.8592 31.462 0 29.6028 0 27.3174ZM17.4995 20.4097V31.462H27.1704C29.4558 31.462 31.315 29.6028 31.315 27.3174V20.4097H17.4995ZM0 4.29161C0 2.00617 1.8592 0.146973 4.14463 0.146973H9.21026V17.6465H0V4.29161Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <Typography variant="h3" className={value ? 'text-high-emphesis' : 'text-secondary'} weight={700}>
                {(valuePlusBalance || bentoBalance)?.toSignificant(6)}
              </Typography>
              <Typography variant="xxs" className="text-secondary">
                {i18n._(t`In BentoBox`)}
              </Typography>
            </div>
          </div>
          <TridentApproveGate inputAmounts={[_value]} tokenApproveOn={bentoboxContract?.address}>
            {({ approved, loading }) => {
              const disabled = !!error || !approved || loading || attemptingTxn
              const buttonText = attemptingTxn ? (
                <Dots>{i18n._(t`Depositing`)}</Dots>
              ) : loading ? (
                ''
              ) : error ? (
                error
              ) : (
                i18n._(t`Confirm Deposit`)
              )

              return (
                <Button
                  {...(loading && {
                    startIcon: (
                      <div className="w-4 h-4 mr-1">
                        <Lottie animationData={loadingCircle} autoplay loop />
                      </div>
                    ),
                  })}
                  color="gradient"
                  disabled={disabled}
                  onClick={execute}
                >
                  <Typography variant="sm" weight={700} className={!error ? 'text-high-emphesis' : 'text-low-emphasis'}>
                    {buttonText}
                  </Typography>
                </Button>
              )
            }}
          </TridentApproveGate>
        </div>
      </div>
    </HeadlessUiModal.Controlled>
  )
}

export default DepositToBentoBoxModal
