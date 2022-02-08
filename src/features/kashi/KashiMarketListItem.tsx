import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyLogoArray } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { KashiMarket } from 'app/features/kashi/types'
import { TABLE_TBODY_TD_CLASSNAME, TABLE_TBODY_TR_CLASSNAME } from 'app/features/trident/constants'
import { classNames, currencyFormatter, formatNumber, formatPercent } from 'app/functions'
import { useCurrency } from 'app/hooks/Tokens'
import React, { FC } from 'react'

interface KashiMarketListItem {
  market: KashiMarket
}
const KashiMarketListItem: FC<KashiMarketListItem> = ({ market }) => {
  const { i18n } = useLingui()
  const asset = useCurrency(market.asset.token) ?? undefined
  const collateral = useCurrency(market.collateral.token) ?? undefined

  return (
    <div className={classNames(TABLE_TBODY_TR_CLASSNAME, 'grid grid-cols-6')} onClick={() => {}}>
      <div className={classNames('flex gap-2', TABLE_TBODY_TD_CLASSNAME(0, 6))}>
        {asset && collateral && <CurrencyLogoArray currencies={[asset, collateral]} dense size={32} />}
        <div className="flex flex-col items-start">
          <Typography weight={700} className="flex gap-1 text-high-emphesis">
            {market.asset.symbol}
            <span className="text-low-emphesis">/</span>
            {market.collateral.symbol}
          </Typography>
          <Typography variant="xs" className="text-low-emphesis">
            {market.oracle.name}
          </Typography>
        </div>
      </div>
      <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(1, 6))}>
        <Typography weight={700} className="text-high-emphesis">
          {formatNumber(market.currentAllAssets.string)} {market.asset.tokenInfo.symbol}
        </Typography>
        <Typography variant="xs" className="text-low-emphesis">
          {currencyFormatter.format(Number(market.currentAllAssets.usd))}
        </Typography>
      </div>
      <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(2, 6))}>
        <Typography weight={700} className="text-high-emphesis">
          {formatNumber(market.currentBorrowAmount.string)} {market.asset.tokenInfo.symbol}
        </Typography>
        <Typography variant="xs" className="text-low-emphesis">
          {currencyFormatter.format(Number(market.currentBorrowAmount.usd))}
        </Typography>
      </div>
      <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(3, 6))}>
        <Typography weight={700} className="text-high-emphesis">
          {formatNumber(market.totalAssetAmount.string)} {market.asset.tokenInfo.symbol}
        </Typography>
        <Typography variant="xs" className="text-low-emphesis">
          {currencyFormatter.format(Number(market.totalAssetAmount.usd))}
        </Typography>
      </div>
      <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(4, 6))}>
        <Typography weight={700} className="text-high-emphesis">
          {formatPercent(market.currentSupplyAPR.stringWithStrategy)}
        </Typography>
        <Typography variant="xs" className="text-low-emphesis">
          {i18n._(t`annualized`)}
        </Typography>
      </div>
      <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(5, 6))}>
        <Typography weight={700} className="text-high-emphesis">
          {formatPercent(market.currentInterestPerYear.string)}
        </Typography>
        <Typography variant="xs" className="text-low-emphesis">
          {i18n._(t`annualized`)}
        </Typography>
      </div>
    </div>
  )
}

export default KashiMarketListItem
