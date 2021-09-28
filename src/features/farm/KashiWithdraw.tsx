import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, currencyEquals, Percent, WNATIVE } from '@sushiswap/sdk'
import React, { useCallback, useState } from 'react'
import Alert from '../../components/Alert'
import Button, { ButtonError } from '../../components/Button'
import Dots from '../../components/Dots'
import Web3Connect from '../../components/Web3Connect'
import { KashiCooker } from '../../entities'
import { tryParseAmount } from '../../functions'
import { maximum, minimum, ZERO } from '../../functions/math'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import useKashiApproveCallback, { BentoApprovalState } from '../../hooks/useKashiApproveCallback'
import { useUSDCValue } from '../../hooks/useUSDCPrice'
import { useKashiInfo } from '../lending/context'
import CurrencyInputPanel from './CurrencyInputPanel'

const KashiWithdraw = ({ pair, useBento }) => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()

  const assetToken = useCurrency(pair?.asset?.address) || undefined

  const [withdrawValue, setWithdrawValue] = useState('')

  const [kashiApprovalState, approveKashiFallback, kashiPermit, onApproveKashi, onCook] = useKashiApproveCallback()

  const amountAvailable = minimum(pair?.maxAssetAvailable ?? ZERO, pair?.currentUserAssetAmount.value ?? ZERO)
  const available =
    assetToken && amountAvailable && CurrencyAmount.fromRawAmount(assetToken, amountAvailable.toString())

  const availableFiatValue = useUSDCValue(available)

  const maxAmount = available

  const parsedWithdrawValue = tryParseAmount(withdrawValue, assetToken)

  async function onWithdraw(cooker: KashiCooker): Promise<string> {
    const maxFraction = minimum(pair.userAssetFraction, pair.maxAssetAvailableFraction)
    const fraction = BigNumber.from(parsedWithdrawValue.quotient.toString()).mulDiv(
      pair.currentTotalAsset.base,
      pair.currentAllAssets.value
    )
    console.log('max', maxFraction.toString())
    console.log(minimum(fraction, maxFraction).toString())
    cooker.removeAsset(minimum(fraction, maxFraction), useBento)
    return `${i18n._(t`Withdraw`)} ${pair.asset.tokenInfo.symbol}`
  }

  const error = !parsedWithdrawValue
    ? 'Enter an amount'
    : available?.lessThan(parsedWithdrawValue)
    ? 'Insufficient balance'
    : undefined

  const isValid = !error

  return (
    <div className="flex flex-col space-y-4">
      <CurrencyInputPanel
        value={withdrawValue}
        currency={assetToken}
        id="add-liquidity-input-tokenb"
        showMaxButton
        onMax={() => {
          setWithdrawValue(maxAmount?.toExact() ?? '')
        }}
        onUserInput={(value) => setWithdrawValue(value)}
        currencyBalance={available}
        fiatValue={availableFiatValue}
      />
      {approveKashiFallback && (
        <Alert
          message={i18n._(
            t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click again and the fallback method will be used`
          )}
          className="mb-4"
        />
      )}
      {amountAvailable?.eq(0) && (
        <Alert
          message={i18n._(
            t`Note: If your KMP is staked, you cannot withdraw your lent tokens. You must unstake first.`
          )}
          className="mb-4"
          type="information"
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
      ) : (
        <ButtonError
          onClick={() => onCook(pair, onWithdraw)}
          disabled={!isValid}
          error={!isValid && !!parsedWithdrawValue}
        >
          {error || i18n._(t`Confirm Withdraw`)}
        </ButtonError>
      )}
    </div>
  )
}

export default KashiWithdraw
