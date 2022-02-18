import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { BENTOBOX_ADDRESS, CurrencyAmount, WNATIVE } from '@sushiswap/core-sdk'
import AssetInput from 'app/components/AssetInput'
import Button from 'app/components/Button'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import Web3Connect from 'app/components/Web3Connect'
import { KashiCooker } from 'app/entities'
import { ZERO } from 'app/functions/math'
import { tryParseAmount } from 'app/functions/parse'
import { useCurrency } from 'app/hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'app/hooks/useApproveCallback'
import useKashiApproveCallback, { BentoApprovalState } from 'app/hooks/useKashiApproveCallback'
import { useActiveWeb3React } from 'app/services/web3'
import { useETHBalances } from 'app/state/wallet/hooks'
import React, { useCallback, useState } from 'react'

// @ts-ignore TYPE NEEDS FIXING
const KashiDeposit = ({ pair, header }) => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const [useBento, setUseBento] = useState<boolean>(false)
  const assetToken = useCurrency(pair?.asset.address) || undefined
  const [depositValue, setDepositValue] = useState('')
  const assetNative = WNATIVE[chainId || 1].address === pair?.asset.address
  // @ts-ignore TYPE NEEDS FIXING
  const ethBalance = useETHBalances(assetNative ? [account ?? undefined] : [])

  const balanceAmount = useBento
    ? pair?.asset.bentoBalance
    : assetNative
    ? account
      ? // @ts-ignore TYPE NEEDS FIXING
        BigNumber.from(ethBalance[account]?.quotient.toString() || 0)
      : undefined
    : pair?.asset.balance

  const balance =
    assetToken &&
    balanceAmount &&
    // @ts-ignore TYPE NEEDS FIXING
    CurrencyAmount.fromRawAmount(assetNative ? WNATIVE[chainId || 1] : assetToken, balanceAmount)

  const parsedDepositValue = tryParseAmount(depositValue, assetToken)
  const [kashiApprovalState, approveKashiFallback, kashiPermit, onApproveKashi, onCook] = useKashiApproveCallback()
  const [tokenApprovalState, onApproveToken] = useApproveCallback(
    parsedDepositValue,
    chainId ? BENTOBOX_ADDRESS[chainId] : undefined
  )

  const onDeposit = useCallback(
    async (cooker: KashiCooker) => {
      if (pair?.currentExchangeRate.isZero()) {
        cooker.updateExchangeRate(false, ZERO, ZERO)
      }
      // @ts-ignore TYPE NEEDS FIXING
      cooker.addAsset(BigNumber.from(parsedDepositValue?.quotient.toString()), useBento)
      return `${i18n._(t`Deposit`)} ${pair?.asset.tokenInfo.symbol}`
    },
    [i18n, pair?.asset.tokenInfo.symbol, pair?.currentExchangeRate, parsedDepositValue?.quotient, useBento]
  )

  const error = !parsedDepositValue
    ? 'Enter an amount'
    : balance.lessThan(parsedDepositValue)
    ? 'Insufficient balance'
    : undefined

  const isValid = !error

  return (
    <>
      <HeadlessUiModal.BorderedContent className="flex flex-col bg-dark-1000/40">
        {header}
        <AssetInput
          title={''}
          value={depositValue}
          currency={assetToken}
          onChange={(val) => setDepositValue(val || '')}
          headerRight={
            <AssetInput.WalletSwitch
              onChange={() => setUseBento(!useBento)}
              checked={useBento}
              id="switch-spend-from-wallet-a"
            />
          }
          spendFromWallet={useBento}
          id="add-liquidity-input-tokenb"
        />
      </HeadlessUiModal.BorderedContent>

      {approveKashiFallback && (
        <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 border !border-red/40 bg-dark-1000/40">
          <Typography variant="sm">
            {i18n._(
              t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click again and the fallback method will be used`
            )}
          </Typography>
        </HeadlessUiModal.BorderedContent>
      )}
      {!account ? (
        <Web3Connect fullWidth />
      ) : isValid &&
        !kashiPermit &&
        (kashiApprovalState === BentoApprovalState.NOT_APPROVED ||
          kashiApprovalState === BentoApprovalState.PENDING) ? (
        <Button
          loading={kashiApprovalState === BentoApprovalState.PENDING}
          onClick={onApproveKashi}
          disabled={kashiApprovalState !== BentoApprovalState.NOT_APPROVED}
        >
          {i18n._(t`Approve Kashi`)}
        </Button>
      ) : isValid &&
        !useBento &&
        (tokenApprovalState === ApprovalState.NOT_APPROVED || tokenApprovalState === ApprovalState.PENDING) ? (
        <Button
          loading={tokenApprovalState === ApprovalState.PENDING}
          onClick={onApproveToken}
          disabled={tokenApprovalState !== ApprovalState.NOT_APPROVED}
        >
          {`${i18n._(t`Approve`)} ${assetToken?.symbol}`}
        </Button>
      ) : (
        <Button
          onClick={() => onCook(pair, onDeposit)}
          disabled={!isValid}
          color={!isValid && !!parsedDepositValue ? 'red' : 'blue'}
        >
          {error || i18n._(t`Confirm Deposit`)}
        </Button>
      )}
    </>
  )
}

export default KashiDeposit
