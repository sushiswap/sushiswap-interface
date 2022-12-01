import { Percent } from '@figswap/core-sdk'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { DEFAULT_DEADLINE_FROM_NOW } from 'app/constants'
import { classNames } from 'app/functions'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import {
  formatSlippageInput,
  GLOBAL_DEFAULT_SLIPPAGE_PERCENT,
  GLOBAL_DEFAULT_SLIPPAGE_STR,
  setSlippageInput,
  SlippageError,
  slippageSelectors,
} from 'app/state/slippage/slippageSlice'
import { useUserTransactionTTL } from 'app/state/user/hooks'
import React, { FC, useState } from 'react'

import Button from '../Button'
import QuestionHelper from '../QuestionHelper'
import Typography from '../Typography'

enum DeadlineError {
  InvalidInput = 'InvalidInput',
}

export interface TransactionSettingsProps {
  placeholderSlippage?: Percent // varies according to the context in which the settings dialog is placed
  trident?: boolean
}

const TransactionSettings: FC<TransactionSettingsProps> = ({ placeholderSlippage, trident = false }) => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()

  const { error: slippageError, percent: slippagePercent, input: slippageInput } = useAppSelector(slippageSelectors)
  const slippageIsDefault = slippagePercent.equalTo(GLOBAL_DEFAULT_SLIPPAGE_PERCENT)

  const [deadline, setDeadline] = useUserTransactionTTL()
  const [deadlineInput, setDeadlineInput] = useState('')
  const [deadlineError, setDeadlineError] = useState<DeadlineError | false>(false)

  function parseCustomDeadline(value: string) {
    // populate what the user typed and clear the error
    setDeadlineInput(value)
    setDeadlineError(false)

    if (value.length === 0) {
      setDeadline(DEFAULT_DEADLINE_FROM_NOW)
    } else {
      try {
        const parsed: number = Math.floor(Number.parseFloat(value) * 60)
        if (!Number.isInteger(parsed) || parsed < 60 || parsed >= Number.MAX_SAFE_INTEGER) {
          setDeadlineError(DeadlineError.InvalidInput)
        } else {
          setDeadline(parsed)
        }
      } catch (error) {
        console.error(error)
        setDeadlineError(DeadlineError.InvalidInput)
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2 border-b-2 pb-4 border-[#292929]">
        <div className="flex items-center">
          <Typography variant="lg" weight={700} className="text-high-emphesis">
            {i18n._(t`Slippage tolerance`)}
          </Typography>

          <QuestionHelper
            text={i18n._(
              t`Your transaction will revert if the price changes unfavorably by more than this percentage.`
            )}
          />
        </div>

        <div className="flex items-center space-x-2">
          <div>
            <Button
              size="sm"
              color={slippageIsDefault ? 'purple' : 'gray'}
              // variant="outlined"
              variant="filled"
              onClick={() => dispatch(setSlippageInput(GLOBAL_DEFAULT_SLIPPAGE_STR))}
            >
              {i18n._(t`AUTO`)}
            </Button>
          </div>
          <div
            className={classNames(
              slippageError === SlippageError.INVALID_INPUT
                ? 'border-red/60'
                : slippageError === SlippageError.TOO_LOW || slippageError === SlippageError.TOO_HIGH
                ? 'border-yellow/60'
                : !slippageIsDefault
                ? 'border-blue'
                : 'border-dark-800',
              'font-mono h-[36px] w-full flex items-center px-2 rounded-md bg-[#292929]'
            )}
            tabIndex={-1}
          >
            <div className="relative w-full">
              <div className="relative w-full">
                <input
                  id="text-slippage"
                  className={classNames(
                    slippageError === SlippageError.INVALID_INPUT ? 'text-red' : '',
                    'font-mono bg-transparent placeholder-low-emphesis min-w-0 w-full font-bold'
                  )}
                  placeholder={placeholderSlippage?.toFixed(2)}
                  value={slippageInput}
                  onChange={(e) => dispatch(setSlippageInput(e.target.value))}
                  onBlur={() =>
                    slippageError === SlippageError.INVALID_INPUT
                      ? dispatch(setSlippageInput(GLOBAL_DEFAULT_SLIPPAGE_STR))
                      : dispatch(formatSlippageInput())
                  }
                  color={slippageError === SlippageError.INVALID_INPUT ? 'red' : ''}
                  autoComplete="off"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Typography variant="lg" weight={700} className="font-sans text-white">
                    {i18n._(t`%`)}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
        {slippageError ? (
          <Typography
            className={classNames(
              slippageError === SlippageError.INVALID_INPUT ? 'text-red' : 'text-yellow',
              'font-medium flex items-center space-x-2'
            )}
            variant="xs"
            weight={700}
          >
            <div>
              {slippageError === SlippageError.INVALID_INPUT
                ? i18n._(t`Enter a valid slippage percentage`)
                : slippageError === SlippageError.TOO_HIGH
                ? i18n._(t`Your transaction may be frontrun`)
                : i18n._(t`Your transaction may fail`)}
            </div>
          </Typography>
        ) : null}
      </div>

      {!trident && (
        <div className="grid gap-2 border-b-2 pb-4 border-[#292929]">
          <div className="flex items-center">
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              {i18n._(t`Transaction deadline`)}
            </Typography>

            <QuestionHelper text={i18n._(t`Your transaction will revert if it is pending for more than this long.`)} />
          </div>
          <div className="relative">
            <input
              className={classNames(
                deadlineError ? 'text-red' : '',
                'font-mono font-bold h-[36px] w-full rounded-md placeholder-low-emphesis bg-[#292929] px-2'
              )}
              placeholder={(DEFAULT_DEADLINE_FROM_NOW / 60).toString()}
              value={
                deadlineInput.length > 0
                  ? deadlineInput
                  : deadline === DEFAULT_DEADLINE_FROM_NOW
                  ? ''
                  : (deadline / 60).toString()
              }
              onChange={(e) => parseCustomDeadline(e.target.value)}
              onBlur={() => {
                setDeadlineInput('')
                setDeadlineError(false)
              }}
              color={deadlineError ? 'red' : ''}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <Typography variant="lg" weight={700} className="font-mono text-white">
                {i18n._(t`MINUTES`)}
              </Typography>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionSettings
