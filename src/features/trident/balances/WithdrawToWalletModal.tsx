import { ArrowDownIcon, XIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ZERO } from '@sushiswap/core-sdk'
import loadingCircle from 'app/animation/loading-circle.json'
import AssetInput from 'app/components/AssetInput'
import Button from 'app/components/Button'
import Dots from 'app/components/Dots'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import WalletSVG from 'app/components/SVG/WalletSVG'
import Typography from 'app/components/Typography'
import { SelectedCurrencyAtom } from 'app/features/trident/balances/context/atoms'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { tryParseAmount } from 'app/functions'
import { useBentoBox, useBentoBoxContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useBentoBalanceV2 } from 'app/state/bentobox/hooks'
import { useCurrencyBalance } from 'app/state/wallet/hooks'
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
  const walletBalance = useCurrencyBalance(account ?? undefined, currency)
  const bentoBalance = useBentoBalanceV2(currency ? currency.wrapped.address : undefined)
  const { withdraw } = useBentoBox()
  const [value, setValue] = useState<string>()
  const { i18n } = useLingui()
  const bentoboxContract = useBentoBoxContract()

  const valueCA = currency ? tryParseAmount(value, currency) : undefined
  let valuePlusBalance = valueCA?.wrapped
  if (valuePlusBalance && walletBalance) valuePlusBalance = valuePlusBalance.wrapped.add(walletBalance.wrapped)

  const execute = useCallback(async () => {
    if (!currency || !value) return

    try {
      setAttemptingTxn(true)
      await withdraw(currency?.wrapped.address, value.toBigNumber(currency?.decimals))
    } finally {
      setAttemptingTxn(false)
      onClose()
    }
  }, [currency, value, withdraw, onClose])

  const error = !account
    ? i18n._(t`Connect Wallet`)
    : !valueCA?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : !bentoBalance
    ? i18n._(t`Loading balance`)
    : valueCA?.greaterThan(bentoBalance)
    ? i18n._(t`Insufficient ${valueCA.currency.symbol} balance`)
    : ''

  return (
    <HeadlessUiModal.Controlled isOpen={open} onDismiss={onClose}>
      <div className="lg:max-w-[28rem] lg:min-w-[28rem]">
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
              title={''}
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
              <WalletSVG />
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
          <TridentApproveGate inputAmounts={[valueCA]} tokenApproveOn={bentoboxContract?.address}>
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
      </div>
    </HeadlessUiModal.Controlled>
  )
}

export default WithdrawToWalletModal
