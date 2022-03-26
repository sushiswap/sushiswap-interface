import { I18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { CurrencyAmount, Percent } from '@sushiswap/core-sdk'
import { CurrencyLogoArray } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { KashiMarketActions } from 'app/features/kashi/KashiMarket'
import { TABLE_TBODY_TD_CLASSNAME, TABLE_TBODY_TR_CLASSNAME } from 'app/features/trident/constants'
import { classNames, currencyFormatter, formatNumber, formatPercent } from 'app/functions'
import { useUSDCValueWithLoadingIndicator } from 'app/hooks/useUSDCPrice'
import Link from 'next/link'
import React, { FC, memo, useMemo } from 'react'

import KashiMediumRiskLendingPair from './KashiMediumRiskLendingPair'

interface KashiMarketListItem {
  market: KashiMediumRiskLendingPair
  i18n: I18n
}

const KashiMarketListItem: FC<KashiMarketListItem> = memo(({ market, i18n }) => {
  const asset = market.asset.token
  const collateral = market.collateral.token

  // @ts-ignore
  const currentAllAssets = useMemo(
    () => (asset ? CurrencyAmount.fromRawAmount(asset, market.currentAllAssets) : undefined),
    [asset, market.currentAllAssets]
  )
  // @ts-ignore
  const currentBorrowAmount = useMemo(
    () => (asset ? CurrencyAmount.fromRawAmount(asset, market.currentBorrowAmount) : undefined),
    [asset, market.currentBorrowAmount]
  )
  // @ts-ignore
  const totalAssetAmount = useMemo(
    () => (asset ? CurrencyAmount.fromRawAmount(asset, market.totalAssetAmount) : undefined),
    [asset, market.totalAssetAmount]
  )

  const { value: currentAllAssetsUSD, loading: currentAllAssetsUSDLoading } =
    useUSDCValueWithLoadingIndicator(currentAllAssets)

  const { value: currentBorrowAmountUSD, loading: currentBorrowAmountUSDLoading } =
    useUSDCValueWithLoadingIndicator(currentBorrowAmount)

  const { value: totalAssetAmountUSD, loading: totalAssetAmountLoading } =
    useUSDCValueWithLoadingIndicator(totalAssetAmount)

  const currentSupplyAPR = new Percent(market.currentSupplyAPR, 1e18)

  const currentInterestPerYear = new Percent(market.currentInterestPerYear, 1e18)

  return (
    <Link href={`/kashi/${market.address}`} passHref={true}>
      <div className={classNames(TABLE_TBODY_TR_CLASSNAME, 'grid grid-cols-7')} onClick={() => {}}>
        <div className={classNames('flex gap-2', TABLE_TBODY_TD_CLASSNAME(0, 7))}>
          {asset && collateral && <CurrencyLogoArray currencies={[asset, collateral]} dense size={32} />}
          <div className="flex flex-col items-start">
            <Typography weight={700} className="flex gap-1 text-high-emphesis">
              {market.asset.token.symbol}
              <span className="text-low-emphesis">/</span>
              {market.collateral.token.symbol}
            </Typography>
            <Typography variant="xs" className="text-low-emphesis">
              {market.oracle.name}
            </Typography>
          </div>
        </div>
        <div className={classNames('flex flex-col !items-end !justify-start', TABLE_TBODY_TD_CLASSNAME(1, 7))}>
          <Typography weight={700} className="text-high-emphesis">
            {formatNumber(currentAllAssets?.toSignificant(6))} {market.asset.token.symbol}
          </Typography>
          <Typography variant="xs" className="text-low-emphesis">
            {currentAllAssetsUSD && !currentAllAssetsUSDLoading
              ? currencyFormatter.format(Number(currentAllAssetsUSD?.toExact()))
              : '-'}
          </Typography>
        </div>
        <div className={classNames('flex flex-col !items-end !justify-start', TABLE_TBODY_TD_CLASSNAME(2, 7))}>
          <Typography weight={700} className="text-high-emphesis">
            {formatNumber(currentBorrowAmount?.toSignificant(6))} {market.asset.token.symbol}
          </Typography>
          <Typography variant="xs" className="text-low-emphesis">
            {currentBorrowAmountUSD && !currentBorrowAmountUSDLoading
              ? currencyFormatter.format(Number(currentBorrowAmountUSD?.toExact()))
              : '-'}
          </Typography>
        </div>

        <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(3, 7))}>
          <Typography weight={700} className="text-high-emphesis">
            {formatPercent(currentSupplyAPR.toFixed(2))}
          </Typography>
          <Typography variant="xs" className="text-low-emphesis">
            {i18n._(t`annualized`)}
          </Typography>
        </div>

        <div className={classNames('flex flex-col !items-end !justify-start', TABLE_TBODY_TD_CLASSNAME(4, 7))}>
          <Typography weight={700} className="text-high-emphesis">
            {formatNumber(totalAssetAmount?.toSignificant(6))} {market.asset.token.symbol}
          </Typography>
          <Typography variant="xs" className="text-low-emphesis">
            {totalAssetAmountUSD && !totalAssetAmountLoading
              ? currencyFormatter.format(Number(totalAssetAmountUSD?.toExact()))
              : '-'}
          </Typography>
        </div>

        <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(5, 7))}>
          <Typography weight={700} className="text-high-emphesis">
            {formatPercent(currentInterestPerYear.toFixed(2))}
          </Typography>
          <Typography variant="xs" className="text-low-emphesis">
            {i18n._(t`annualized`)}
          </Typography>
        </div>
        <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(6, 7))}>
          <KashiMarketActions market={market} />
        </div>
      </div>
    </Link>
  )
})

export default memo(KashiMarketListItem)
