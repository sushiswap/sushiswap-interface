import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Lottie from 'lottie-react'
import React from 'react'

import loadingCircle from '../../animation/loading-circle.json'
import Typography from '../../components/Typography'
import { escapeRegExp } from '../../functions'
import { classNames } from '../../functions/styling'

const digitRegex = RegExp(`^\\d*$`)

export const Input = React.memo(
  ({
    label,
    value,
    type = 'text',
    onUserInput,
    placeholder,
    alert,
    hint,
    trailing,
    className,
    error,
    onAction,
    actionTitle,
    actionVisible,
    actionPending,
    ...rest
  }: {
    label?: string
    value?: string | number
    type?: string
    onUserInput?: (input: string) => void
    alert?: string
    hint?: any
    trailing?: any
    error?: boolean
    onAction?: any
    actionTitle?: string
    actionVisible?: boolean
    actionPending?: boolean
  } & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) => {
    const { i18n } = useLingui()

    const enforcer = (nextUserInput: string) => {
      if (type === 'digit' && !digitRegex.test(escapeRegExp(nextUserInput))) return
      onUserInput(nextUserInput)
    }

    const [alertVisible, showAlert] = React.useState(false)

    return (
      <div className="mb-5">
        <div className="text-white text-xl">{i18n._(t`${label}`)}</div>
        <div className="mt-3 w-full flex flex-row">
          <div className="flex-1">
            <div className="py-2 px-5 rounded bg-dark-800 w-full relative">
              <input
                className={classNames(
                  error ? 'text-red' : value ? 'text-white' : '',
                  'bg-transparent placeholder-low-emphesis w-full'
                )}
                placeholder={i18n._(t`${placeholder}`)}
                value={value}
                onChange={(e) => enforcer(e.target.value)}
                color={error ? 'red' : ''}
                onBlur={() => showAlert(false)}
                onFocus={() => showAlert(true)}
                {...rest}
              />

              {trailing && <div className="absolute top-2 right-5">{trailing}</div>}
            </div>
            {hint && <div className="mt-2 flex flex-row items-center">{hint}</div>}

            {alertVisible && (
              <div className="flex flex-row items-center bg-purple bg-opacity-20 bg- mt-2 p-3 rounded">
                <ExclamationCircleIcon className="w-5 h-5 mr-2 text-purple" aria-hidden="true" />
                <Typography>{i18n._(t`${alert}`)}</Typography>
              </div>
            )}
          </div>
          <div className="ml-3 w-[200px]">
            {(actionVisible || actionPending) && (
              <Typography
                className={classNames(
                  'px-5 py-2 cursor-pointer text-center text-white rounded-md border border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-pink flex flex-row items-center justify-center',
                  actionPending ? 'cursor-not-allowed' : 'hover:from-blue hover:to-pink'
                )}
                onClick={!actionPending ? onAction : null}
              >
                {actionPending && (
                  <div className="w-[12px] h-[12px] mr-3">
                    <Lottie animationData={loadingCircle} autoplay loop size={8} />
                  </div>
                )}
                {i18n._(t`${actionTitle}`)}
              </Typography>
            )}
          </div>
        </div>
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
