import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { BENTOBOX_ADDRESS, CurrencyAmount, WNATIVE } from '@sushiswap/core-sdk'
import Alert from 'app/components/Alert'
import Button, { ButtonError } from 'app/components/Button'
import Dots from 'app/components/Dots'
import Web3Connect from 'app/components/Web3Connect'
import { KashiCooker } from 'app/entities'
import { ZERO } from 'app/functions/math'
import { tryParseAmount } from 'app/functions/parse'
import { useCurrency } from 'app/hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'app/hooks/useApproveCallback'
import useKashiApproveCallback, { BentoApprovalState } from 'app/hooks/useKashiApproveCallback'
import { useUSDCValue } from 'app/hooks/useUSDCPrice'
import { useActiveWeb3React } from 'app/services/web3'
import { useETHBalances } from 'app/state/wallet/hooks'
import React, { useState } from 'react'

import CurrencyInputPanel from './CurrencyInputPanel'

const KashiDeposit = ({ pair, useBento }) => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()

  const assetToken = useCurrency(pair?.asset.address) || undefined

  const [depositValue, setDepositValue] = useState('')

  const assetNative = WNATIVE[chainId || 1].address === pair?.asset.address
  const ethBalance = useETHBalances(assetNative ? [account] : [])

  const balanceAmount = useBento
    ? pair?.asset.bentoBalance
    : assetNative
    ? BigNumber.from(ethBalance[account]?.quotient.toString() || 0)
    : pair?.asset.balance

  const balance =
    assetToken &&
    balanceAmount &&
    CurrencyAmount.fromRawAmount(assetNative ? WNATIVE[chainId] : assetToken, balanceAmount)

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

export default KashiDeposit
