import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, Route, TradeVersion } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import TradePrice from 'app/features/legacy/swap/TradePrice'
import { classNames, computeRealizedLPFeePercent, shortenAddress } from 'app/functions'
import { getTradeVersion } from 'app/functions/getTradeVersion'
import useSwapSlippageTolerance from 'app/hooks/useSwapSlippageTollerence'
import { TradeUnion } from 'app/types'
import React, { FC, Fragment, useState } from 'react'
import { isAddress } from 'web3-utils'

interface SwapDetailsContent {
  trade?: TradeUnion
  recipient?: string
}

interface SwapDetails {
  inputCurrency?: Currency
  outputCurrency?: Currency
  recipient?: string
  trade?: TradeUnion
  className?: string
}

const SwapDetails: FC<SwapDetails> = ({ inputCurrency, outputCurrency, recipient, trade, className }) => {
  const [inverted, setInverted] = useState(false)

  return (
    <Disclosure as="div">
      {({ open }) => (
        <div
          className={classNames(
            open ? 'bg-dark-900' : '',
            'shadow-inner flex flex-col gap-2 py-2 rounded px-2 border border-dark-700 transition hover:border-dark-700',
            className
          )}
        >
          <div className="flex justify-between gap-2 items-center pl-2">
            <div>
              <TradePrice
                inputCurrency={inputCurrency}
                outputCurrency={outputCurrency}
                price={trade?.executionPrice}
                showInverted={inverted}
                setShowInverted={setInverted}
              />
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
              <SwapDetailsContent trade={trade} recipient={recipient} />
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  )
}

const SwapDetailsContent: FC<SwapDetails> = ({ trade, recipient }) => {
  const { i18n } = useLingui()
  const allowedSlippage = useSwapSlippageTolerance(trade)
  const minReceived = trade?.minimumAmountOut(allowedSlippage)
  const realizedLpFeePercent = trade ? computeRealizedLPFeePercent(trade) : undefined

  let path
  if (trade && getTradeVersion(trade) === TradeVersion.V2TRADE) {
    path = (trade.route as Route<Currency, Currency>).path
  }

  return (
    <div className="flex flex-col divide-y divide-dark-850">
      <div className="flex flex-col gap-1 pb-2">
        <div className="flex justify-between gap-4">
          <Typography variant="xs">{i18n._(t`Expected Output`)}</Typography>
          <Typography weight={700} variant="xs" className="text-right">
            {trade?.outputAmount?.toSignificant(6)} {trade?.outputAmount?.currency.symbol}
          </Typography>
        </div>
        <div className="flex justify-between gap-4">
          <Typography variant="xs">{i18n._(t`Price Impact`)}</Typography>
          <Typography variant="xs" className="text-right">
            {trade?.priceImpact?.toFixed(2)}%
          </Typography>
        </div>
        {recipient && isAddress(recipient) && (
          <div className="flex justify-between gap-4">
            <Typography variant="xs">{i18n._(t`Recipient`)}</Typography>
            <Typography variant="xs" className="text-right">
              {shortenAddress(recipient)}
            </Typography>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 pt-2">
        <div className="flex justify-between gap-4">
          <Typography variant="xs" className="text-secondary">
            {i18n._(t`Minimum received after slippage`)} ({allowedSlippage.toFixed(2)}%)
          </Typography>
          <Typography variant="xs" className="text-right text-secondary">
            {minReceived?.toSignificant(6)} {minReceived?.currency.symbol}
          </Typography>
        </div>
        {realizedLpFeePercent && (
          <div className="flex justify-between gap-4">
            <Typography variant="xs" className="text-secondary">
              {i18n._(t`Liquidity provider fee`)}
            </Typography>
            <Typography variant="xs" className="text-right text-secondary">
              {realizedLpFeePercent.toFixed(2)}%
            </Typography>
          </div>
        )}
        {path && (
          <div className="grid grid-cols-2 gap-4">
            <Typography variant="xs" className="text-secondary">
              {i18n._(t`Route`)}
            </Typography>
            <Typography variant="xs" className="text-right text-secondary">
              {path.map((el) => el.symbol).join(' > ')}
            </Typography>
          </div>
        )}
      </div>
    </div>
  )
}

export default SwapDetails
