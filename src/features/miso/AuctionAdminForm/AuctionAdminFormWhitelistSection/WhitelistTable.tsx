import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { WhitelistEntry } from 'app/features/miso/context/types'
import React, { FC } from 'react'

interface WhitelistTableProps {
  entries: WhitelistEntry[]
}

const WhitelistTable: FC<WhitelistTableProps> = ({ entries }) => {
  const { i18n } = useLingui()

  return (
    <div className="col-span-6 md:col-span-3 pt-8">
      <Typography weight={700}>{i18n._(t`Addresses`)}</Typography>
      <div className="min-h-[140px] mt-2 divide-y divide-dark-800 border border-dark-800 rounded bg-dark-900">
        <div className="px-4 py-2 grid grid-cols-3 items-center">
          <Typography variant="sm" weight={700} className="text-secondary">
            #
          </Typography>
          <Typography variant="sm" weight={700} className="text-secondary">
            {i18n._(t`Account`)}
          </Typography>
          <Typography variant="sm" weight={700} className="text-right text-secondary">
            {i18n._(t`Amount`)}
          </Typography>
        </div>
        <div className="max-h-[200px] overflow-auto bg-dark-1000/40">
          {entries.map(({ account, amount }, index) => (
            <div className="px-4 grid grid-cols-3 py-1 items-center overflow-hidden" key={index}>
              <Typography variant="sm">{index + 1}</Typography>
              <Typography variant="xs" weight={700} className="truncate">
                {account}
              </Typography>
              <Typography variant="xs" weight={700} className="text-right">
                {amount}
              </Typography>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 grid grid-cols-3 items-center">
          <Typography variant="sm" weight={700} className="text-secondary">
            {entries.length}
          </Typography>
          <Typography variant="sm" weight={700} className="text-secondary">
            -
          </Typography>
          <Typography variant="sm" weight={700} className="text-right text-secondary">
            {entries.reduce((acc, cur) => acc + Number(cur.amount), 0)}
          </Typography>
        </div>
      </div>
      <p className="mt-2 text-sm text-yellow">
        {i18n._(
          t`There is currently no way of retrieving the list of addresses in the point list. This means you won't be able to see the list of set addresses after you refresh this page.`
        )}
      </p>
    </div>
  )
}

export default WhitelistTable
