import { I18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { ChainId, CurrencyAmount, Percent, Token } from '@sushiswap/core-sdk'
import { CurrencyLogoArray } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { KashiMarket } from 'app/features/kashi/types'
import { TABLE_TBODY_TD_CLASSNAME, TABLE_TBODY_TR_CLASSNAME } from 'app/features/trident/constants'
import { classNames, currencyFormatter, formatNumber, formatPercent } from 'app/functions'
import { useUSDCValueWithLoadingIndicator } from 'app/hooks/useUSDCPrice'
import Link from 'next/link'
import React, { FC, memo } from 'react'

interface KashiMarketListItem {
  market: KashiMarket
  chainId: ChainId
  i18n: I18n
}

const KashiMarketListItem: FC<KashiMarketListItem> = memo(({ market, chainId, i18n }) => {
  const asset = new Token(
    chainId,
    market.asset.token.address,
    market.asset.token.decimals,
    market.asset.token.symbol,
    market.asset.token.name
  )

  const collateral = new Token(
    chainId,
    market.collateral.token.address,
    market.collateral.token.decimals,
    market.collateral.token.symbol,
    market.collateral.token.name
  )

  // @ts-ignore
  const currentAllAssets = asset ? CurrencyAmount.fromRawAmount(asset, market.currentAllAssets) : undefined
  // @ts-ignore
  const currentBorrowAmount = asset ? CurrencyAmount.fromRawAmount(asset, market.currentBorrowAmount) : undefined
  // @ts-ignore
  const totalAssetAmount = asset ? CurrencyAmount.fromRawAmount(asset, market.totalAssetAmount) : undefined

  const { value: currentAllAssetsUSD, loading: currentAllAssetsUSDLoading } =
    useUSDCValueWithLoadingIndicator(currentAllAssets)
  const { value: currentBorrowAmountUSD, loading: currentBorrowAmountUSDLoading } =
    useUSDCValueWithLoadingIndicator(currentBorrowAmount)
  const { value: totalAssetAmountUSD, loading: totalAssetAmountLoading } =
    useUSDCValueWithLoadingIndicator(totalAssetAmount)

  // @ts-ignore
  const currentSupplyAPR = new Percent(market.currentSupplyAPR, 1e18)
  // @ts-ignore
  const currentInterestPerYear = new Percent(market.currentInterestPerYear, 1e18)

  return (
    <Link href={`/kashi/${market.address}`} passHref={true}>
      <div className={classNames(TABLE_TBODY_TR_CLASSNAME, 'grid grid-cols-6')} onClick={() => {}}>
        <div className={classNames('flex gap-2', TABLE_TBODY_TD_CLASSNAME(0, 6))}>
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
        <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(1, 6))}>
          <Typography weight={700} className="text-high-emphesis">
            {formatNumber(currentAllAssets?.toSignificant(6))} {market.asset.token.symbol}
          </Typography>
          <Typography variant="xs" className="text-low-emphesis">
            {currentAllAssetsUSD && !currentAllAssetsUSDLoading
              ? currencyFormatter.format(Number(currentAllAssetsUSD?.toExact()))
              : '-'}
          </Typography>
        </div>
        <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(2, 6))}>
          <Typography weight={700} className="text-high-emphesis">
            {formatNumber(currentBorrowAmount?.toSignificant(6))} {market.asset.token.symbol}
          </Typography>
          <Typography variant="xs" className="text-low-emphesis">
            {currentBorrowAmountUSD && !currentBorrowAmountUSDLoading
              ? currencyFormatter.format(Number(currentBorrowAmountUSD?.toExact()))
              : '-'}
          </Typography>
        </div>
        <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(3, 6))}>
          <Typography weight={700} className="text-high-emphesis">
            {formatNumber(totalAssetAmount?.toSignificant(6))} {market.asset.token.symbol}
          </Typography>
          <Typography variant="xs" className="text-low-emphesis">
            {totalAssetAmountUSD && !totalAssetAmountLoading
              ? currencyFormatter.format(Number(totalAssetAmountUSD?.toExact()))
              : '-'}
          </Typography>
        </div>
        <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(4, 6))}>
          <Typography weight={700} className="text-high-emphesis">
            {formatPercent(currentSupplyAPR.toFixed(2))}
          </Typography>
          <Typography variant="xs" className="text-low-emphesis">
            {i18n._(t`annualized`)}
          </Typography>
        </div>
        <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(5, 6))}>
          <Typography weight={700} className="text-high-emphesis">
            {formatPercent(currentInterestPerYear.toFixed(2))}
          </Typography>
          <Typography variant="xs" className="text-low-emphesis">
            {i18n._(t`annualized`)}
          </Typography>
        </div>
      </div>
    </Link>
  )
})

export default KashiMarketListItem
