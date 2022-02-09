import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { ArrowSmRightIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Percent, Price, ZERO } from '@sushiswap/core-sdk'
import QuestionHelper from 'app/components/QuestionHelper'
import Tooltip from 'app/components/Tooltip'
import Typography from 'app/components/Typography'
import { LTV } from 'app/features/kashi/constants'
import { KashiMarket } from 'app/features/kashi/types'
import { classNames, formatNumber, formatPercent } from 'app/functions'
import React, { FC, Fragment, useState } from 'react'

interface KashiMarketBorrowDetailsView {
  market: KashiMarket
  collateralAmount?: CurrencyAmount<Currency>
  borrowAmount?: CurrencyAmount<Currency>
  priceImpact?: Percent
}

const KashiMarketBorrowDetailsContentView: FC<KashiMarketBorrowDetailsView> = ({
  priceImpact,
  market,
  collateralAmount,
  borrowAmount,
}) => {
  const { i18n } = useLingui()
  return (
    <div className="flex flex-col divide-y divide-dark-850">
      <div className="flex flex-col gap-1 pb-2">
        <div className="flex justify-between gap-4">
          <Typography variant="xs">{i18n._(t`APR (annualized)`)}</Typography>
          <Typography variant="xs" className="text-right">
            {formatPercent(market.currentInterestPerYear.string)}
          </Typography>
        </div>

        <div className="flex justify-between gap-4">
          <Typography variant="xs">{i18n._(t`Loan to Value (LTV)`)}</Typography>
          <Typography variant="xs" className="text-right">
            75%
          </Typography>
        </div>
        {priceImpact && (
          <div className="flex justify-between gap-4">
            <Typography variant="xs">{i18n._(t`Price Impact`)}</Typography>
            <Typography variant="xs" className="text-right">
              {priceImpact.toSignificant(2)}%
            </Typography>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <Typography variant="xs" className="flex items-center">
            {i18n._(t`BentoBox strategy`)}
            <QuestionHelper
              text={
                <div>
                  <Typography variant="xs">
                    BentoBox strategies can create yield for your liquidity while it is not lent out.
                  </Typography>
                </div>
              }
            />
          </Typography>
          {market.asset.strategy ? (
            <Tooltip
              text={
                <div className="flex flex-col">
                  <div className="flex justify-between gap-4">
                    <Typography variant="xs">{i18n._(t`Strategy APY`)}</Typography>
                    <Typography variant="xs" className="text-right">
                      {formatPercent(market.asset.strategy.apy)}
                    </Typography>
                  </div>
                  <div className="flex justify-between gap-4">
                    <Typography variant="xs">{i18n._(t`Current Percentage`)}</Typography>
                    <Typography variant="xs" className="text-right">
                      {formatPercent(market.asset.strategy.targetPercentage)}
                    </Typography>
                  </div>
                  <div className="flex justify-between gap-4">
                    <Typography variant="xs">{i18n._(t`Target Percentage`)}</Typography>
                    <Typography variant="xs" className="text-right">
                      {formatPercent(market.asset.strategy.utilization)}
                    </Typography>
                  </div>
                </div>
              }
            >
              <Typography variant="xs" className={classNames(market.asset.strategy ? 'text-blue' : '', 'text-right')}>
                {market.asset.strategy ? i18n._(t`Active`) : i18n._(t`None`)}{' '}
              </Typography>
            </Tooltip>
          ) : (
            <Typography variant="xs" className={classNames(market.asset.strategy ? 'text-blue' : '', 'text-right')}>
              {market.asset.strategy ? i18n._(t`Active`) : i18n._(t`None`)}{' '}
            </Typography>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1 pt-2">
        <div className="flex justify-between gap-4">
          <Typography variant="xs" className="text-secondary">
            {i18n._(t`Total collateral`)}
          </Typography>
          <div className="flex gap-1">
            <Typography variant="xs" className="text-right text-secondary">
              {formatNumber(market.userCollateralAmount.string)} {market.collateral.tokenInfo.symbol}
            </Typography>
            <ArrowSmRightIcon width={14} className="text-secondary" />
            <Typography variant="xs" className="text-right text-secondary">
              {formatNumber(+market.userCollateralAmount.string + +(collateralAmount?.toExact() || 0))}{' '}
              {market.collateral.tokenInfo.symbol}
            </Typography>
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <Typography variant="xs" className="text-secondary">
            {i18n._(t`Total borrowed`)}
          </Typography>
          <div className="flex gap-1">
            <Typography variant="xs" className="text-right text-secondary">
              {formatNumber(market.currentUserBorrowAmount.string)} {market.asset.tokenInfo.symbol}
            </Typography>
            <ArrowSmRightIcon width={14} className="text-secondary" />
            <Typography variant="xs" className="text-right text-secondary">
              {formatNumber(+market.currentUserBorrowAmount.string + +(borrowAmount?.toExact() || 0))}{' '}
              {market.asset.tokenInfo.symbol}
            </Typography>
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <Typography variant="xs" className="text-secondary">
            {i18n._(t`Oracle`)}
          </Typography>
          <Typography variant="xs" className="text-right text-secondary">
            {market.oracle.name}
          </Typography>
        </div>
      </div>
    </div>
  )
}

const KashiMarketBorrowDetailsView: FC<KashiMarketBorrowDetailsView> = ({
  priceImpact,
  market,
  collateralAmount,
  borrowAmount,
}) => {
  const { i18n } = useLingui()
  const [invert, setInvert] = useState(false)

  const liquidationPrice =
    borrowAmount && collateralAmount && borrowAmount.greaterThan(ZERO)
      ? new Price({ baseAmount: borrowAmount.multiply(LTV), quoteAmount: collateralAmount })
      : undefined

  const price = invert
    ? `1 ${collateralAmount?.currency.symbol} = ${liquidationPrice?.invert().toSignificant(6)} ${
        borrowAmount?.currency.symbol
      }`
    : `1 ${borrowAmount?.currency.symbol} = ${liquidationPrice?.toSignificant(6)} ${collateralAmount?.currency.symbol}`

  return (
    <Disclosure as="div">
      {({ open }) => (
        <div
          className={classNames(
            open ? 'bg-dark-900' : '',
            'shadow-inner flex flex-col gap-2 py-2 rounded px-2 border border-dark-700 transition hover:border-dark-700'
          )}
        >
          <div className="flex justify-between gap-2 items-center pl-1">
            <div className="flex gap-3 items-center" onClick={() => setInvert((prev) => !prev)}>
              <Typography variant="xs" weight={700} className="flex -ml-1 gap-2">
                <QuestionHelper
                  text={
                    <div className="flex flex-col gap-2">
                      <Typography variant="xs" className="text-white">
                        {i18n._(
                          t`When the value of your collateral becomes less than the asset you borrowed, your position gets liquidated.`
                        )}
                      </Typography>
                      <Typography variant="xs" className="italic">
                        {i18n._(
                          t`When a non-leveraged positions gets liquidated, you lose the collateral but you can keep the borrowed assets`
                        )}
                      </Typography>
                    </div>
                  }
                />
                {i18n._(t`Liquidation Price`)}
              </Typography>
              {liquidationPrice && (
                <Typography
                  variant="xs"
                  weight={700}
                  className="cursor-pointer bg-dark-700/80 hover:bg-dark-700 rounded px-3 py-1"
                >
                  {price}
                </Typography>
              )}
            </div>

            <Disclosure.Button as={Fragment}>
              <div className="flex flex-grow items-center justify-end p-1 cursor-pointer rounded">
                <ChevronDownIcon
                  width={20}
                  className={classNames(open ? 'transform rotate-180' : '', 'transition hover:text-white')}
                />
              </div>
            </Disclosure.Button>
          </div>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            unmount={false}
          >
            <Disclosure.Panel static className="px-1 pt-2">
              <KashiMarketBorrowDetailsContentView
                priceImpact={priceImpact}
                market={market}
                collateralAmount={collateralAmount}
                borrowAmount={borrowAmount}
              />
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  )
}

export default KashiMarketBorrowDetailsView
