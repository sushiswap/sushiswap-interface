import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { WNATIVE } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import KashiCooker from 'app/entities/KashiCooker'
import { Direction, TransactionReview } from 'app/entities/TransactionReview'
import { Warnings } from 'app/entities/Warnings'
import { formatNumber } from 'app/functions/format'
import { e10, ZERO } from 'app/functions/math'
import { useBentoBoxContract } from 'app/hooks'
import { useCurrency } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import { useETHBalances } from 'app/state/wallet/hooks'
import React, { useState } from 'react'

import { KashiApproveButton, TokenApproveButton } from './Button'
import SmartNumberInput from './SmartNumberInput'
import TransactionReviewList from './TransactionReview'
import WarningsList from './WarningsList'

export default function Deposit({ pair }: any): JSX.Element {
  const { account, chainId } = useActiveWeb3React()

  const assetToken = useCurrency(pair.asset.address) || undefined

  const bentoBoxContract = useBentoBoxContract()

  const { i18n } = useLingui()

  // State
  const [useBento, setUseBento] = useState<boolean>(pair.asset.bentoBalance.gt(0))
  const [value, setValue] = useState('')

  // Calculated
  // @ts-ignore TYPE NEEDS FIXING
  const assetNative = WNATIVE[chainId].address === pair.asset.address

  // @ts-ignore TYPE NEEDS FIXING
  const ethBalance = useETHBalances(assetNative ? [account] : [])

  const balance = useBento
    ? pair.asset.bentoBalance
    : assetNative
    ? //  @ts-ignore TYPE NEEDS FIXING
      BigNumber.from(ethBalance[account]?.quotient.toString() || 0)
    : pair.asset.balance

  const max = useBento
    ? pair.asset.bentoBalance
    : assetNative
    ? // @ts-ignore TYPE NEEDS FIXING
      BigNumber.from(ethBalance[account]?.quotient.toString() || 0)
    : pair.asset.balance

  const warnings = new Warnings()

  warnings.add(
    balance?.lt(value.toBigNumber(pair.asset.tokenInfo.decimals)),
    i18n._(
      t`Please make sure your ${useBento ? 'BentoBox' : 'wallet'} balance is sufficient to deposit and then try again.`
    ),
    true
  )

  const transactionReview = new TransactionReview()

  if (value && !warnings.broken) {
    const amount = value.toBigNumber(pair.asset.tokenInfo.decimals)
    const newUserAssetAmount = pair.currentUserAssetAmount.value.add(amount)
    transactionReview.addTokenAmount(
      i18n._(t`Balance`),
      pair.currentUserAssetAmount.value,
      newUserAssetAmount,
      pair.asset
    )
    transactionReview.addUSD(i18n._(t`Balance USD`), pair.currentUserAssetAmount.value, newUserAssetAmount, pair.asset)
    const newUtilization = e10(18).mulDiv(pair.currentBorrowAmount.value, pair.currentAllAssets.value.add(amount))
    transactionReview.addPercentage(i18n._(t`Borrowed`), pair.utilization.value, newUtilization)
    if (pair.currentExchangeRate.isZero()) {
      transactionReview.add(
        'Exchange Rate',
        formatNumber(
          pair.currentExchangeRate.toFixed(18 + pair.collateral.tokenInfo.decimals - pair.asset.tokenInfo.decimals)
        ),
        formatNumber(
          pair.oracleExchangeRate.toFixed(18 + pair.collateral.tokenInfo.decimals - pair.asset.tokenInfo.decimals)
        ),
        Direction.UP
      )
    }
    transactionReview.addPercentage(i18n._(t`Supply APR`), pair.supplyAPR.value, pair.currentSupplyAPR.value)
  }

  // Handlers
  async function onExecute(cooker: KashiCooker): Promise<string> {
    if (pair.currentExchangeRate.isZero()) {
      cooker.updateExchangeRate(false, ZERO, ZERO)
    }
    const amount = value.toBigNumber(pair.asset.tokenInfo.decimals)

    // @ts-ignore TYPE NEEDS FIXING
    const deadBalance = await bentoBoxContract.balanceOf(
      pair.asset.address,
      '0x000000000000000000000000000000000000dead'
    )

    cooker.addAsset(amount, useBento, deadBalance.isZero())

    return `${i18n._(t`Deposit`)} ${pair.asset.tokenInfo.symbol}`
  }

  return (
    <>
      <div className="mt-6 text-3xl text-high-emphesis">Deposit {pair.asset.tokenInfo.symbol}</div>

      <SmartNumberInput
        color="blue"
        token={pair.asset}
        value={value}
        setValue={setValue}
        useBentoTitleDirection="down"
        useBentoTitle="from"
        useBento={useBento}
        setUseBento={setUseBento}
        maxTitle="Balance"
        max={max}
        showMax={true}
      />

      <WarningsList warnings={warnings} />
      <TransactionReviewList transactionReview={transactionReview} />

      <KashiApproveButton
        color="blue"
        content={(onCook: any) => (
          <TokenApproveButton value={value} token={assetToken} needed={!useBento}>
            <Button
              onClick={() => onCook(pair, onExecute)}
              disabled={value.toBigNumber(pair.asset.tokenInfo.decimals).lte(0) || warnings.broken}
              fullWidth={true}
            >
              {i18n._(t`Deposit`)}
            </Button>
          </TokenApproveButton>
        )}
      />
    </>
  )
}
