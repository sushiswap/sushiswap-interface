import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount } from '@sushiswap/core-sdk'
import AssetInput from 'app/components/AssetInput'
import Button from 'app/components/Button'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import Web3Connect from 'app/components/Web3Connect'
import { KashiCooker } from 'app/entities'
import { tryParseAmount } from 'app/functions'
import { minimum, ZERO } from 'app/functions/math'
import { useCurrency } from 'app/hooks/Tokens'
import useKashiApproveCallback, { BentoApprovalState } from 'app/hooks/useKashiApproveCallback'
import { useActiveWeb3React } from 'app/services/web3'
import React, { useCallback, useState } from 'react'

// @ts-ignore TYPE NEEDS FIXING
const KashiWithdraw = ({ pair, header }) => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const [useBento, setUseBento] = useState<boolean>(false)
  const assetToken = useCurrency(pair?.asset?.address) || undefined
  const [withdrawValue, setWithdrawValue] = useState('')
  const [kashiApprovalState, approveKashiFallback, kashiPermit, onApproveKashi, onCook] = useKashiApproveCallback()
  const amountAvailable = minimum(pair?.maxAssetAvailable ?? ZERO, pair?.currentUserAssetAmount.value ?? ZERO)
  const available =
    assetToken && amountAvailable && CurrencyAmount.fromRawAmount(assetToken, amountAvailable.toString())
  const parsedWithdrawValue = tryParseAmount(withdrawValue, assetToken)

  const onWithdraw = useCallback(
    async (cooker: KashiCooker) => {
      const maxFraction = minimum(pair.userAssetFraction, pair.maxAssetAvailableFraction)
      // @ts-ignore TYPE NEEDS FIXING
      const fraction = BigNumber.from(parsedWithdrawValue?.quotient.toString()).mulDiv(
        pair.currentTotalAsset.base,
        pair.currentAllAssets.value
      )
      cooker.removeAsset(minimum(fraction, maxFraction), useBento)
      return `${i18n._(t`Withdraw`)} ${pair.asset.tokenInfo.symbol}`
    },
    [
      i18n,
      pair?.asset.tokenInfo.symbol,
      pair?.currentAllAssets.value,
      pair?.currentTotalAsset.base,
      pair?.maxAssetAvailableFraction,
      pair?.userAssetFraction,
      parsedWithdrawValue?.quotient,
      useBento,
    ]
  )

  const error = !parsedWithdrawValue
    ? 'Enter an amount'
    : available?.lessThan(parsedWithdrawValue)
    ? 'Insufficient balance'
    : undefined

  const isValid = !error

  return (
    <>
      <HeadlessUiModal.BorderedContent className="flex flex-col bg-dark-1000/40">
        {header}
        <div>
          <AssetInput
            title={''}
            value={withdrawValue}
            currency={assetToken}
            onChange={(val) => setWithdrawValue(val || '')}
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
        </div>
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

      {!amountAvailable?.eq(0) && (
        <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 border !border-blue/40 bg-dark-1000/40">
          <Typography variant="sm">
            {i18n._(t`If your KMP is staked, you cannot withdraw your lent tokens. You must unstake first.`)}
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
          fullWidth
          loading={kashiApprovalState === BentoApprovalState.PENDING}
          onClick={onApproveKashi}
          disabled={kashiApprovalState !== BentoApprovalState.NOT_APPROVED}
        >
          {i18n._(t`Approve Kashi`)}
        </Button>
      ) : (
        <Button
          fullWidth
          color={!isValid && !!parsedWithdrawValue ? 'red' : 'blue'}
          onClick={() => onCook(pair, onWithdraw)}
          disabled={!isValid}
        >
          {error || i18n._(t`Confirm Withdraw`)}
        </Button>
      )}
    </>
  )
}

export default KashiWithdraw
