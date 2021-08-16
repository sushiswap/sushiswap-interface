import React, { useRef, useState } from 'react'
import { useSetUserSlippageTolerance, useUserSlippageTolerance, useUserTransactionTTL } from '../../state/user/hooks'

import { DEFAULT_DEADLINE_FROM_NOW } from '../../constants'
import { Percent } from '@sushiswap/sdk'
import QuestionHelper from '../QuestionHelper'
import Typography from '../Typography'
import { classNames } from '../../functions'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from '../Button'

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

enum DeadlineError {
  InvalidInput = 'InvalidInput',
}

export interface TransactionSettingsProps {
  placeholderSlippage?: Percent // varies according to the context in which the settings dialog is placed
}

export default function TransactionSettings({ placeholderSlippage }: TransactionSettingsProps) {
  const { i18n } = useLingui()

  const inputRef = useRef<HTMLInputElement>()

  const userSlippageTolerance = useUserSlippageTolerance()
  const setUserSlippageTolerance = useSetUserSlippageTolerance()

  const [deadline, setDeadline] = useUserTransactionTTL()

  const [slippageInput, setSlippageInput] = useState('')
  const [slippageError, setSlippageError] = useState<SlippageError | false>(false)

  const [deadlineInput, setDeadlineInput] = useState('')
  const [deadlineError, setDeadlineError] = useState<DeadlineError | false>(false)

  function parseSlippageInput(value: string) {
    // populate what the user typed and clear the error
    setSlippageInput(value)
    setSlippageError(false)

    if (value.length === 0) {
      setUserSlippageTolerance('auto')
    } else {
      const parsed = Math.floor(Number.parseFloat(value) * 100)

      if (!Number.isInteger(parsed) || parsed < 0 || parsed > 5000) {
        setUserSlippageTolerance('auto')
        if (value !== '.') {
          setSlippageError(SlippageError.InvalidInput)
        }
      } else {
        setUserSlippageTolerance(new Percent(parsed, 10_000))
      }
    }
  }

  const tooLow = userSlippageTolerance !== 'auto' && userSlippageTolerance.lessThan(new Percent(5, 10_000))
  const tooHigh = userSlippageTolerance !== 'auto' && userSlippageTolerance.greaterThan(new Percent(1, 100))

  function parseCustomDeadline(value: string) {
    // populate what the user typed and clear the error
    setDeadlineInput(value)
    setDeadlineError(false)

    if (value.length === 0) {
      setDeadline(DEFAULT_DEADLINE_FROM_NOW)
    } else {
      try {
        const parsed: number = Math.floor(Number.parseFloat(value) * 60)
        if (!Number.isInteger(parsed) || parsed < 60 || parsed > 180 * 60) {
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
    <div className="grid gap-4">
      <div className="grid gap-2">
        <div className="flex items-center">
          <Typography variant="sm" className="text-high-emphesis">
            {i18n._(t`Slippage tolerance`)}
          </Typography>

          <QuestionHelper
            text={i18n._(
              t`Your transaction will revert 23if the price changes unfavorably by more than this percentage.`
            )}
          />
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={classNames(
              !!slippageError
                ? 'border-red'
                : tooLow || tooHigh
                ? 'border-yellow'
                : userSlippageTolerance !== 'auto'
                ? 'border-blue'
                : 'border-transparent',
              'border p-2 rounded bg-dark-800'
            )}
            tabIndex={-1}
          >
            <div className="flex items-center justify-between gap-1">
              {tooLow || tooHigh ? (
                <span className="hidden sm:inline text-yellow" role="img" aria-label="warning">
                  ⚠️
                </span>
              ) : null}
              <input
                className={classNames(slippageError ? 'text-red' : '', 'bg-transparent placeholder-low-emphesis')}
                placeholder={placeholderSlippage?.toFixed(2)}
                value={
                  slippageInput.length > 0
                    ? slippageInput
                    : userSlippageTolerance === 'auto'
                    ? ''
                    : userSlippageTolerance.toFixed(2)
                }
                onChange={(e) => parseSlippageInput(e.target.value)}
                onBlur={() => {
                  setSlippageInput('')
                  setSlippageError(false)
                }}
                color={slippageError ? 'red' : ''}
              />
              %
            </div>
          </div>
          <Button
            size="sm"
            color={userSlippageTolerance === 'auto' ? 'blue' : 'gray'}
            variant={userSlippageTolerance === 'auto' ? 'filled' : 'outlined'}
            onClick={() => {
              parseSlippageInput('')
            }}
          >
            {i18n._(t`Auto`)}
          </Button>
        </div>
        {slippageError || tooLow || tooHigh ? (
          <Typography
            className={classNames(
              slippageError === SlippageError.InvalidInput ? 'text-red' : 'text-yellow',
              'font-medium flex items-center space-x-2'
            )}
            variant="sm"
          >
            <div>
              {slippageError === SlippageError.InvalidInput
                ? i18n._(t`Enter a valid slippage percentage`)
                : slippageError === SlippageError.RiskyLow
                ? i18n._(t`Your transaction may fail`)
                : i18n._(t`Your transaction may be frontrun`)}
            </div>
          </Typography>
        ) : null}
      </div>

      <div className="grid gap-2">
        <div className="flex items-center">
          <Typography variant="sm" className="text-high-emphesis">
            {i18n._(t`Transaction deadline`)}
          </Typography>

          <QuestionHelper text={i18n._(t`Your transaction will revert if it is pending for more than this long.`)} />
        </div>
        <div className="flex items-center">
          <div
            className="p-2 rounded bg-dark-800 min-w-[82px] max-w-[102px]"
            style={{ maxWidth: '40px', marginRight: '8px' }}
            tabIndex={-1}
          >
            <input
              className={classNames(deadlineError ? 'text-red' : '', 'bg-transparent placeholder-low-emphesis')}
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
          </div>
          <Typography variant="sm">{i18n._(t`minutes`)}</Typography>
        </div>
      </div>
    </div>
  )
}
