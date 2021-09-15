import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React from 'react'

import Typography from '../../components/Typography'
import { classNames } from '../../functions/styling'
import { CalendarIcon } from '@heroicons/react/outline'
import Input from './Input'
import { BigNumber } from '@ethersproject/bignumber'
import { DuplicateIcon, ArrowSmRightIcon } from '@heroicons/react/outline'
import useCopyClipboard from '../../hooks/useCopyClipboard'
import { format } from 'date-fns'
import ConfirmAuctionRow from './ConfirmAuctionRow'

function PriceRow({ title1, title2, price1, price2, currency }) {
  const { i18n } = useLingui()

  return (
    <div className="grid grid-cols-2 gap-8 text-primary mb-2">
      <div>
        <Typography variant="sm" className="text-primary mb-1">
          {i18n._(`${title1}`)}
        </Typography>
        <Typography className="rounded bg-dark-900 px-4 py-0.5">{i18n._(`${price1} ${currency}`)}</Typography>
      </div>
      <div className="flex items-start">
        <div className="flex flex-col items-center">
          <div className="flex space-x-1 mb-1">
            <ArrowSmRightIcon className="text-secondary w-[20px] h-[20px] transform rotate-45" />
            <Typography variant="sm" className="text-primary">
              {i18n._(`${title2}`)}
            </Typography>
          </div>
          <Typography variant="sm" className="rounded bg-blue bg-opacity-50 px-2">
            {i18n._(`${price2} ${currency}`)}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmAuction({
  auctionType,
  auctionToken,
  auctionTokenAllowance,
  auctionTokenAmount,
  auctionStartDate,
  auctionEndDate,
  paymentCurrency,
  fundWallet,
  startingPrice,
  endingPrice,
}) {
  const { i18n } = useLingui()

  return (
    <div className="mb-3 mr-[200px]">
      <Typography variant="h3" className="text-primary font-bold">
        {i18n._(t`Confirm Your Auction Setup`)}
      </Typography>
      <div className="grid grid-cols-12 gap-10 mt-3">
        <div className="col-span-7">
          <ConfirmAuctionRow title="Auction Type" content={auctionType} />
          <ConfirmAuctionRow
            title="Auction Token"
            content={auctionToken.name + ' (' + auctionToken.symbol + ')'}
            toCopy={auctionToken.address}
            showCopy
          />
          <ConfirmAuctionRow
            title="Auction Token Allowance"
            content={auctionTokenAllowance + ' ' + auctionToken.symbol}
          />
          <ConfirmAuctionRow title="Auction Token Amount" content={auctionTokenAmount + ' ' + auctionToken.symbol} />
          <ConfirmAuctionRow
            title="Auction Start &amp; End"
            content={format(auctionStartDate, 'PPpp') + ' - ' + format(auctionEndDate, 'PPpp')}
          />
        </div>
        <div className="col-span-5">
          <ConfirmAuctionRow
            title="Payment Currency"
            content={paymentCurrency.name + '(' + paymentCurrency.symbol + ')'}
            toCopy={paymentCurrency.address}
            showCopy
          />
          <ConfirmAuctionRow title="Fund Wallet" toCopy={fundWallet} showCopy />
          <Typography className="text-secondary font-bold my-1">{i18n._(t`Price Settings`)}*</Typography>
          <PriceRow
            title1="STARTING PRICE"
            title2="MAXIMUM RAISED"
            currency={paymentCurrency.symbol}
            price1={startingPrice}
            price2={`${auctionTokenAmount * parseFloat(startingPrice)}`}
          />
          <PriceRow
            title1="ENDING PRICE"
            title2="MINIMUM RAISED"
            currency={paymentCurrency.symbol}
            price1={endingPrice}
            price2={`${auctionTokenAmount * parseFloat(endingPrice)}`}
          />
        </div>
      </div>
    </div>
  )
}
