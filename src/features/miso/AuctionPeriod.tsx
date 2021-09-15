import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React, { forwardRef } from 'react'

import Typography from '../../components/Typography'
import { classNames } from '../../functions/styling'
import { CalendarIcon } from '@heroicons/react/outline'
import Input from './Input'
import { BigNumber } from '@ethersproject/bignumber'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ExclamationCircleIcon } from '@heroicons/react/solid'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'

export default function AuctionPeriod({ className, startDate, endDate, onChange }: any) {
  const { i18n } = useLingui()

  const [_alertVisible, showAlert] = React.useState(false)

  const node = React.useRef<HTMLDivElement>()
  useOnClickOutside(node, () => showAlert(false))

  const DateInput = forwardRef(({ value, date, onClick }: any, ref: any) => (
    <div className="flex py-2 px-5 rounded bg-dark-900 border border-dark-800" onClick={onClick} ref={ref}>
      <div className="flex-1">{date ? format(date, 'PPppp') : null}</div>
      <CalendarIcon className="text-secondary w-[24px] h-[24px]" />
    </div>
  ))

  return (
    <div
      className={classNames('mb-3 mr-[200px] mt-8', className)}
      onClick={() => {
        showAlert(true)
      }}
      ref={node}
    >
      <Typography className="text-primary text-xl">{i18n._(t`Auction Start & End`)}*</Typography>
      <div className="grid grid-cols-2 gap-4 my-3">
        <div>
          <DatePicker
            selected={startDate}
            showTimeSelect
            onChange={(date) => onChange(date, endDate)}
            customInput={<DateInput date={startDate} />}
          />
        </div>
        <div>
          <DatePicker
            selected={endDate}
            showTimeSelect
            onChange={(date) => onChange(startDate, date)}
            customInput={<DateInput date={endDate} />}
          />
        </div>
        {/* <div className="flex py-2 px-5 rounded bg-dark-900 border border-dark-800">
                <div className="flex-1">{startDate}</div>
                <CalendarIcon className="text-secondary w-[24px] h-[24px]" />
            </div>
            <div className="flex py-2 px-5 rounded bg-dark-900 border border-dark-800">
                <div className="flex-1">{endDate}</div>
                <CalendarIcon className="text-secondary w-[24px] h-[24px]" />
            </div> */}
      </div>
      {_alertVisible && (
        <div className="flex flex-row bg-purple bg-opacity-20 space-x-3 mt-2 px-4 py-3 rounded">
          <ExclamationCircleIcon className="w-[24px] h-[24px] text-purple" />
          <Typography className="flex-1 text-sm text-primary">
            {i18n._(
              t`Select the dates for when your auction will be hold.  Most common duration is two weeks, but it can be whatever you like.`
            )}
          </Typography>
        </div>
      )}
    </div>
  )
}
