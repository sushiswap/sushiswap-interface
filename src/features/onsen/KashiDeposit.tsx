import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { BENTOBOX_ADDRESS, CurrencyAmount, WNATIVE } from '@sushiswap/sdk'
import React, { useState } from 'react'
import Button, { ButtonError } from '../../components/Button'
import Dots from '../../components/Dots'
import Web3Connect from '../../components/Web3Connect'
import { KashiCooker } from '../../entities'
import { ZERO } from '../../functions/math'
import { ApprovalState, useActiveWeb3React, useApproveCallback } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import useKashiApproveCallback, { BentoApprovalState } from '../../hooks/useKashiApproveCallback'
import CurrencyInputPanel from './CurrencyInputPanel'
import Provider, { useKashiInfo } from '../lending/context'
import { tryParseAmount } from '../../functions'
import Alert from '../../components/Alert'
import { useUSDCValue } from '../../hooks/useUSDCPrice'
import { BigNumber } from '@ethersproject/bignumber'

const KashiDeposit = ({ pair, useBento }) => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()

  const assetToken = useCurrency(pair?.asset.address) || undefined
  const info = useKashiInfo()

  const [depositValue, setDepositValue] = useState('')

  const assetNative = WNATIVE[chainId || 1].address === pair?.asset.address

  const balanceAmount = useBento ? pair?.asset.bentoBalance : assetNative ? info?.ethBalance : pair?.asset.balance
  const balance =
    assetToken &&
    balanceAmount &&
    CurrencyAmount.fromRawAmount(assetNative ? WNATIVE[chainId || 1] : assetToken, balanceAmount)

  const maxAmount = balance

  const parsedDepositValue = tryParseAmount(depositValue, assetToken)

  const fiatValue = useUSDCValue(parsedDepositValue ?? balance)

  const [kashiApprovalState, approveKashiFallback, kashiPermit, onApproveKashi, onCook] = useKashiApproveCallback()

  const [tokenApprovalState, onApproveToken] = useApproveCallback(
    parsedDepositValue,
    chainId && BENTOBOX_ADDRESS[chainId]
  )

  async function onDeposit(cooker: KashiCooker): Promise<string> {
    if (pair?.currentExchangeRate.isZero()) {
      cooker.updateExchangeRate(false, ZERO, ZERO)
    }
    cooker.addAsset(BigNumber.from(parsedDepositValue.quotient.toString()), useBento)
    return `${i18n._(t`Deposit`)} ${pair?.asset.tokenInfo.symbol}`
  }

  const error = !parsedDepositValue
    ? 'Enter an amount'
    : balance.lessThan(parsedDepositValue)
    ? 'Insufficient balance'
    : undefined

  const isValid = !error

  return (
    <div className="flex flex-col space-y-4">
      <CurrencyInputPanel
        value={depositValue}
        currency={assetToken}
        id="add-liquidity-input-tokenb"
        onUserInput={(value) => setDepositValue(value)}
        showMaxButton
        onMax={() => {
          setDepositValue(maxAmount?.toExact() ?? '')
        }}
        currencyBalance={balance}
        fiatValue={fiatValue}
      />
      {approveKashiFallback && (
        <Alert
          message={i18n._(
            t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click again and the fallback method will be used`
          )}
          className="mb-4"
        />
      )}
      {!account ? (
        <Web3Connect size="lg" color="blue" className="w-full" />
      ) : isValid &&
        !kashiPermit &&
        (kashiApprovalState === BentoApprovalState.NOT_APPROVED ||
          kashiApprovalState === BentoApprovalState.PENDING) ? (
        <Button
          color="gradient"
          size="lg"
          onClick={onApproveKashi}
          disabled={kashiApprovalState !== BentoApprovalState.NOT_APPROVED}
        >
          {kashiApprovalState === BentoApprovalState.PENDING ? (
            <Dots>{i18n._(t`Approving Kashi`)}</Dots>
          ) : (
            i18n._(t`Approve Kashi`)
          )}
        </Button>
      ) : isValid &&
        !useBento &&
        (tokenApprovalState === ApprovalState.NOT_APPROVED || tokenApprovalState === ApprovalState.PENDING) ? (
        <Button
          color="gradient"
          size="lg"
          onClick={onApproveToken}
          disabled={tokenApprovalState !== ApprovalState.NOT_APPROVED}
        >
          {tokenApprovalState === ApprovalState.PENDING ? (
            <Dots>
              {i18n._(t`Approving`)} {assetToken?.symbol}
            </Dots>
          ) : (
            `${i18n._(t`Approve`)} ${assetToken?.symbol}`
          )}
        </Button>
      ) : (
        <ButtonError
          onClick={() => onCook(pair, onDeposit)}
          disabled={!isValid}
          error={!isValid && !!parsedDepositValue}
        >
          {error || i18n._(t`Confirm Deposit`)}
        </ButtonError>
      )}
    </div>
  )
}

KashiDeposit.Provider = Provider

export default KashiDeposit
