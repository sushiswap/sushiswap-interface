import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React from 'react'

import Typography from '../../components/Typography'
import { classNames } from '../../functions/styling'
import { ArrowSmRightIcon } from '@heroicons/react/outline'
import Input from './Input'
import { BigNumber } from '@ethersproject/bignumber'

export default function DutchAuctionSettings({
  className,
  startingPrice,
  endingPrice,
  onChange,
  tokenAmount,
  paymentCurrency,
}: any) {
  const { i18n } = useLingui()

  return (
    <div className={classNames('mb-3 mr-[200px] mt-8', className)}>
      <Typography className="text-primary text-xl">{i18n._(t`Dutch Auction Settings`)}*</Typography>
      <div className="grid grid-cols-2 gap-4 mt-3">
        <div className="">
          <Typography className="text-secondary font-bold">{i18n._(t`STARTING PRICE`)}</Typography>
          <Typography className="text-low-emphesis text-sm">
            {i18n._(t`Dutch auctions start high, and lowers over time`)}
          </Typography>
          <Input
            value={startingPrice}
            type="decimal"
            placeholder="0.00"
            onUserInput={(input) => onChange(input, endingPrice)}
            trailing={<span>{paymentCurrency ? paymentCurrency : 'ETH'}</span>}
            padding={false}
          />
          <div className="flex space-x-1 items-center">
            <ArrowSmRightIcon className="text-secondary w-[22px] h-[22px] transform rotate-45" />
            <Typography className="text-secondary font-bold">{i18n._(t`MAXIMUM RAISED`)}</Typography>
          </div>
          <Typography className="text-low-emphesis text-sm">
            {i18n._(t`Maximum amount raised if all tokens are sold at highest price possible`)}
          </Typography>
          <Typography className="mt-2 inline-block text-primary text-sm rounded bg-blue bg-opacity-50 px-3 py-0.5">
            {startingPrice && paymentCurrency && tokenAmount
              ? i18n._(t`${tokenAmount * parseFloat(startingPrice)} ${paymentCurrency}`)
              : '0.00 ETH'}
          </Typography>
        </div>
        <div className="">
          <Typography className="text-secondary font-bold">{i18n._(t`ENDING PRICE`)}</Typography>
          <Typography className="text-low-emphesis text-sm">{i18n._(t`Auction ends at this price`)}</Typography>
          <Input
            value={endingPrice}
            type="decimal"
            placeholder="0.00"
            onUserInput={(input) => onChange(startingPrice, input)}
            trailing={<span>{paymentCurrency ? paymentCurrency : 'ETH'}</span>}
            padding={false}
          />
          <div className="flex space-x-1 items-center">
            <ArrowSmRightIcon className="text-secondary w-[22px] h-[22px] transform rotate-45" />
            <Typography className="text-secondary font-bold">{i18n._(t`MINIMUM RAISED`)}</Typography>
          </div>
          <Typography className="text-low-emphesis text-sm">
            {i18n._(t`Maximum amount raised in order to have a successful auction`)}
          </Typography>
          <Typography className="mt-2 inline-block text-primary text-sm rounded bg-blue bg-opacity-50 px-3 py-0.5">
            {endingPrice && paymentCurrency && tokenAmount
              ? i18n._(t`${tokenAmount * parseFloat(endingPrice)} ${paymentCurrency}`)
              : '0.00 ETH'}
          </Typography>
        </div>
      </div>
    </div>
  )
}
