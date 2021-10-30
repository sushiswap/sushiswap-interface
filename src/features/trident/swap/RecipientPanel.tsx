import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Input from 'components/Input'
import Typography from 'components/Typography'
import { classNames } from 'functions'
import { useActiveWeb3React } from 'hooks'
import useENS from 'hooks/useENS'
import React from 'react'
import { atom, useRecoilState } from 'recoil'

const recipientAtom = atom<string | undefined>({
  key: 'RecipientPanel:recipientAtom',
  default: undefined,
})

const RecipientPanel = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const [recipient, setRecipient] = useRecoilState(recipientAtom)
  const { address, loading } = useENS(recipient)

  const error = Boolean(recipient && recipient.length > 0 && !loading && !address)

  if (recipient === undefined) {
    return (
      <div className="flex justify-center">
        <Typography
          variant="sm"
          weight={700}
          className="text-blue cursor-pointer py-1"
          onClick={() => setRecipient('')}
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
      <div className="flex justify-between border-b border-dark-700 lg:border-transparent lg:p-0 px-4 py-2">
        <Typography variant="xs" className="text-secondary" weight={700}>
          {i18n._(t`Send to:`)}
        </Typography>
        <Typography variant="xs" className="text-blue" weight={700} onClick={() => setRecipient(undefined)}>
          {i18n._(t`Remove recipient`)}
        </Typography>
      </div>
      <div className="flex flex-col">
        <Input.Address
          placeholder={i18n._(t`Wallet address or ENS name`)}
          onUserInput={setRecipient}
          value={recipient}
          className={classNames(
            error ? 'border-red/50' : 'border-transparent',
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

RecipientPanel.atom = recipientAtom
export default RecipientPanel
