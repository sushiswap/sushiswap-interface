import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Chip from 'app/components/Chip'
import QuestionHelper from 'app/components/QuestionHelper'
import Tooltip from 'app/components/Tooltip'
import Typography from 'app/components/Typography'
import { KashiMarket } from 'app/features/kashi/types'
import { classNames, formatNumber, formatPercent } from 'app/functions'
import React, { FC, Fragment } from 'react'

interface KashiMarketBorrowDetailsView {
  market: KashiMarket
}

const KashiMarketBorrowDetailsContentView: FC<KashiMarketBorrowDetailsView> = ({ market }) => {
  const { i18n } = useLingui()
  return (
    <div className="flex flex-col divide-y divide-dark-850">
      <div className="flex flex-col gap-1 pb-2">
        <div className="flex justify-between gap-4">
          <Typography variant="xs">{i18n._(t`APR (annualized)`)}</Typography>
          <Typography weight={700} variant="xs" className="text-right">
            {formatPercent(market.currentInterestPerYear.string)}
          </Typography>
        </div>
        <div className="flex justify-between gap-4">
          <Typography variant="xs">{i18n._(t`Loan to Value (LTV)`)}</Typography>
          <Typography variant="xs" className="text-right">
            75%
          </Typography>
        </div>
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
            {i18n._(t`Total Borrowed`)}
          </Typography>
          <Typography variant="xs" className="text-right text-secondary">
            {formatNumber(market.currentBorrowAmount.string)} {market.asset.tokenInfo.symbol}
          </Typography>
        </div>
        <div className="flex justify-between gap-4">
          <Typography variant="xs" className="text-secondary">
            {i18n._(t`Available`)}
          </Typography>
          <Typography variant="xs" className="text-right text-secondary">
            {formatNumber(market.totalAssetAmount.string)} {market.asset.tokenInfo.symbol}
          </Typography>
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

const KashiMarketBorrowDetailsView: FC<KashiMarketBorrowDetailsView> = ({ market }) => {
  return (
    <Disclosure as="div">
      {({ open }) => (
        <div
          className={classNames(
            open ? 'bg-dark-900' : '',
            'shadow-inner flex flex-col gap-2 py-2 rounded px-2 border border-dark-700 transition hover:border-dark-700'
          )}
        >
          <div className="flex justify-between gap-2 items-center pl-2">
            <div className="flex gap-3 items-center">
              <Typography variant="sm" weight={700}>
                Position Health
              </Typography>
              <Chip color="green" label="75%" />
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
              <KashiMarketBorrowDetailsContentView market={market} />
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  )
}

export default KashiMarketBorrowDetailsView
