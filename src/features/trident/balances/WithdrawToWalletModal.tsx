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
import { useTokenBalance } from 'app/state/wallet/hooks'
import Lottie from 'lottie-react'
import React, { FC, useCallback, useState } from 'react'
import { useRecoilValue } from 'recoil'

interface WithdrawToWalletModalProps {
  open: boolean
  onClose(): void
}

const WithdrawToWalletModal: FC<WithdrawToWalletModalProps> = ({ open, onClose }) => {
  const { account } = useActiveWeb3React()
  const currency = useRecoilValue(SelectedCurrencyAtom)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const walletBalance = useTokenBalance(account ?? undefined, currency?.wrapped)
  const [bentoBalance] = useBentoBalances(currency ? [currency.wrapped] : undefined)
  const { withdraw } = useBentoBox()
  const [value, setValue] = useState<string>()
  const { i18n } = useLingui()
  const bentoboxContract = useBentoBoxContract()

  let _value = currency ? tryParseAmount(value, currency) : undefined
  let valuePlusBalance = _value
  if (valuePlusBalance && walletBalance) valuePlusBalance = valuePlusBalance.add(walletBalance)

  const execute = useCallback(async () => {
    if (!currency || !value) return

    try {
      setAttemptingTxn(true)
      await withdraw(currency?.wrapped.address, value.toBigNumber(currency?.decimals))
    } finally {
      setAttemptingTxn(false)
    }
  }, [currency, withdraw, value])

  let error = !account
    ? i18n._(t`Connect Wallet`)
    : !_value?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : !bentoBalance
    ? i18n._(t`Loading balance`)
    : _value?.greaterThan(bentoBalance)
    ? i18n._(t`Insufficient ${_value.currency.symbol} balance`)
    : ''

  return (
    <HeadlessUiModal.Controlled isOpen={open} onDismiss={onClose} className="!bg-dark-800">
      <div className="flex flex-col bg-dark-900 p-5 gap-5">
        <div className="flex flex-col gap-5">
          <div className="flex justify-between">
            <Typography variant="h2" className="text-high-emphesis" weight={700}>
              {i18n._(t`Withdraw to`)}
              <br />
              {i18n._(t`Wallet`)}
            </Typography>
            <div className="w-8 h-8 cursor-pointer" onClick={onClose}>
              <XIcon width={30} />
            </div>
          </div>
          <AssetInput
            title={' '}
            currency={currency}
            onChange={(val) => setValue(val)}
            value={value}
            spendFromWallet={false}
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
            <svg width="20" height="20" viewBox="0 0 43 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M37.6022 31.099H3.39382C1.97809 31.099 0.827545 29.9484 0.827545 28.5327V2.56627C0.827545 1.15055 1.97809 0 3.39382 0H37.6022C39.018 0 40.1685 1.15055 40.1685 2.56627V8.3575H27.8889C26.9693 8.3575 26.0711 8.54141 25.2285 8.89641C24.4159 9.23859 23.6845 9.73473 23.06 10.3592C22.4356 10.9837 21.9394 11.715 21.5973 12.5277C21.238 13.3703 21.0583 14.2685 21.0583 15.1881V15.9109C21.0583 16.8305 21.2423 17.7287 21.5973 18.5713C21.9394 19.3839 22.4356 20.1153 23.06 20.7398C23.6845 21.3642 24.4159 21.8604 25.2285 22.2025C26.0711 22.5619 26.9693 22.7415 27.8889 22.7415H40.1685V28.5327C40.1685 29.9484 39.018 31.099 37.6022 31.099ZM41.0753 10.924C42.1403 10.924 43 11.7838 43 12.8488V18.2507C43 19.3157 42.1403 20.1754 41.0753 20.1754H40.1685H27.8889C25.5322 20.1754 23.6246 18.2679 23.6246 15.9112V15.1883C23.6246 12.8316 25.5322 10.924 27.8889 10.924H40.1685H41.0753ZM26.3192 15.5476C26.3192 16.8009 27.3329 17.8145 28.5861 17.8145C29.8393 17.8145 30.853 16.8009 30.853 15.5476C30.853 14.2944 29.8393 13.2807 28.5861 13.2807C27.3329 13.2807 26.3192 14.2944 26.3192 15.5476Z"
                fill="#currentColor"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <Typography variant="h3" className={value ? 'text-high-emphesis' : 'text-secondary'} weight={700}>
              {(valuePlusBalance || walletBalance)?.toSignificant(6)}
            </Typography>
            <Typography variant="xxs" className="text-secondary">
              {i18n._(t`In Wallet`)}
            </Typography>
          </div>
        </div>
        <TridentApproveGate inputAmounts={[_value]} tokenApproveOn={bentoboxContract?.address}>
          {({ approved, loading }) => {
            const disabled = !!error || !approved || loading || attemptingTxn
            const buttonText = attemptingTxn ? (
              <Dots>{i18n._(t`Withdrawing`)}</Dots>
            ) : loading ? (
              ''
            ) : error ? (
              error
            ) : (
              i18n._(t`Confirm Withdrawal`)
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
    </HeadlessUiModal.Controlled>
  )
}

export default WithdrawToWalletModal
