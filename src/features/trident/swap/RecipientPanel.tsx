import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Input from 'app/components/Input'
import Typography from 'app/components/Typography'
import { selectTridentSwap, setRecipient } from 'app/features/trident/swap/swapSlice'
import { classNames } from 'app/functions/styling'
import useENS from 'app/hooks/useENS'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { useIsExpertMode } from 'app/state/user/hooks'
import React, { useEffect } from 'react'

const RecipientPanel = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { recipient } = useAppSelector(selectTridentSwap)
  const dispatch = useAppDispatch()
  const { address, loading } = useENS(recipient)
  const expertMode = useIsExpertMode()
  const error = Boolean(recipient && recipient.length > 0 && !loading && !address)
  const valid = Boolean(recipient && recipient.length > 0 && address && !loading)

  // Reset recipient when expert mode is turned off or on unmount
  useEffect(() => {
    if (!expertMode) {
      dispatch(setRecipient(undefined))
    }

    return () => {
      dispatch(setRecipient(undefined))
    }
  }, [dispatch, expertMode])

  if (recipient === undefined) {
    return (
      <div className="flex justify-center">
        <Typography
          id="btn-add-recipient"
          variant="sm"
          weight={700}
          className="py-1 cursor-pointer text-blue"
          onClick={() => dispatch(setRecipient(''))}
        >
          {i18n._(t`+ Add Recipient (optional)`)}
        </Typography>
      </div>
    )
  }

  return (
    <div
      className={classNames(
        recipient && account !== address ? 'lg:pb-0' : 'lg:pb-5',
        'border border-dark-700 flex flex-col lg:p-5 rounded lg:gap-3'
      )}
    >
      <div className="flex justify-between px-4 py-2 border-b border-dark-700 lg:border-transparent lg:p-0">
        <Typography variant="xs" className="text-secondary" weight={700}>
          {i18n._(t`Send to:`)}
        </Typography>
        <Typography variant="xs" className="text-blue" weight={700} onClick={() => dispatch(setRecipient(undefined))}>
          {i18n._(t`Remove recipient`)}
        </Typography>
      </div>
      <div className="flex flex-col">
        <Input.Address
          id="recipient-input"
          placeholder={i18n._(t`Wallet address or ENS name`)}
          onUserInput={(val) => dispatch(setRecipient(val))}
          value={recipient}
          className={classNames(
            error ? 'border-red/50' : 'border-transparent',
            valid ? 'border-green/40' : 'border-transparent',
            'border text-inherit w-full lg:bg-dark-1000 lg:rounded-full px-4 lg:py-2 py-5 font-bold'
          )}
          fontSize="14px"
        />
        {recipient && account !== address && (
          <div className="flex items-start lg:items-center gap-2.5 px-4 lg:px-0 border-t border-dark-700 lg:border-none py-3">
            <div className="w-5 h-5">
              <ExclamationCircleIcon className="text-yellow" width={20} />
            </div>
            <Typography variant="xs" className="text-secondary" weight={700}>
              {i18n._(t`Please note the recipient address is different from the connected wallet address.`)}
            </Typography>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecipientPanel
