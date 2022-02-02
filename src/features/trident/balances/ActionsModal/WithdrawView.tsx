import { parseUnits } from '@ethersproject/units'
import { ArrowDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { JSBI, Rebase, ZERO } from '@sushiswap/core-sdk'
import AssetInput from 'app/components/AssetInput'
import Button from 'app/components/Button'
import { WalletIcon } from 'app/components/Icon'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { useBalancesSelectedCurrency } from 'app/features/trident/balances/useBalancesDerivedState'
import { toShareJSBI, tryParseAmount } from 'app/functions'
import { useBentoBox } from 'app/hooks'
import useBentoRebases from 'app/hooks/useBentoRebases'
import { useActiveWeb3React } from 'app/services/web3'
import { useBentoBalanceV2 } from 'app/state/bentobox/hooks'
import { useCurrencyBalance } from 'app/state/wallet/hooks'
import React, { FC, useCallback, useState } from 'react'

interface WithdrawViewProps {
  onBack(): void
  onClose(): void
}

const WithdrawView: FC<WithdrawViewProps> = ({ onClose, onBack }) => {
  const { account } = useActiveWeb3React()
  const currency = useBalancesSelectedCurrency()
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const walletBalance = useCurrencyBalance(account ?? undefined, currency)
  const { data: bentoBalance } = useBentoBalanceV2(currency ? currency.wrapped.address : undefined)
  const { withdraw } = useBentoBox()
  const { rebases } = useBentoRebases([currency?.wrapped])
  const [inputState, setInputState] = useState<{ value?: string; isMax: boolean }>({ value: undefined, isMax: false })
  const { i18n } = useLingui()

  const valueCA = currency ? tryParseAmount(inputState.value, currency) : undefined
  let valuePlusBalance = valueCA?.wrapped
  if (valuePlusBalance && walletBalance) valuePlusBalance = valuePlusBalance.wrapped.add(walletBalance.wrapped)

  const execute = useCallback(async () => {
    if (!currency || !inputState.value) return

    try {
      setAttemptingTxn(true)
      if (inputState.isMax) {
        await withdraw(
          currency?.wrapped.address,
          inputState.value.toBigNumber(currency?.decimals),
          rebases?.[currency.wrapped.address]
            ? toShareJSBI(
                rebases[currency.wrapped.address] as Rebase,
                JSBI.BigInt(parseUnits(inputState.value, currency?.decimals))
              )
            : undefined
        )
      } else {
        await withdraw(currency?.wrapped.address, inputState.value.toBigNumber(currency?.decimals))
      }
    } finally {
      setAttemptingTxn(false)
      onClose()
    }
  }, [currency, inputState.value, inputState.isMax, withdraw, rebases, onClose])

  const error = !account
    ? i18n._(t`Connect Wallet`)
    : !valueCA?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : !bentoBalance
    ? i18n._(t`Loading balance`)
    : valueCA?.greaterThan(bentoBalance)
    ? i18n._(t`Insufficient ${valueCA.currency.symbol} balance`)
    : ''

  const disabled = !!error || attemptingTxn
  const buttonText = error ? error : i18n._(t`Confirm Withdrawal`)

  return (
    <div className="flex flex-col gap-4">
      <HeadlessUiModal.Header header={i18n._(t`Withdraw to wallet`)} onClose={onClose} onBack={onBack} />
      <AssetInput
        title={''}
        currency={currency}
        onChange={(val, isMax) => setInputState({ value: val, isMax: isMax || false })}
        value={inputState.value}
        spendFromWallet={false}
      />
      <div className="z-10 flex justify-center -mt-6 -mb-6">
        <div className="p-1.5 rounded-full bg-dark-800 border border-dark-800 shadow-md border-dark-700">
          <ArrowDownIcon width={14} className="text-high-emphesis" />
        </div>
      </div>
      <HeadlessUiModal.BorderedContent className="flex gap-3 px-3 bg-dark-900">
        <div className="border border-dark-700 rounded-full w-[48px] h-[48px] flex items-center justify-center shadow-md">
          <WalletIcon width={20} height={20} />
        </div>
        <div className="flex flex-col gap-1">
          <Typography variant="h3" className={inputState.value ? 'text-high-emphesis' : 'text-secondary'} weight={700}>
            {(valuePlusBalance || walletBalance)?.toSignificant(6)}
          </Typography>
          <Typography variant="xxs" className="text-secondary">
            {i18n._(t`In Wallet`)}
          </Typography>
        </div>
      </HeadlessUiModal.BorderedContent>
      <Button loading={attemptingTxn} color="gradient" disabled={disabled} onClick={execute}>
        <Typography variant="sm" weight={700} className={!error ? 'text-high-emphesis' : 'text-low-emphasis'}>
          {buttonText}
        </Typography>
      </Button>
    </div>
  )
}

export default WithdrawView
