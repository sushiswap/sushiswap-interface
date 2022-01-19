import { CheckCircleIcon, DocumentDuplicateIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { classNames } from 'app/functions'
import useCopyClipboard from 'app/hooks/useCopyClipboard'
import React, { FC } from 'react'

import Typography from '../Typography'

interface CopyHelperProps {
  className?: string
  toCopy: string
  children?: React.ReactNode
}

const CopyHelper: FC<CopyHelperProps> = ({ className, toCopy, children }) => {
  const [isCopied, setCopied] = useCopyClipboard()
  const { i18n } = useLingui()

  return (
    <div
      className={classNames(
        'flex items-center flex-shrink-0 space-x-1 no-underline cursor-pointer whitespace-nowrap hover:no-underline focus:no-underline active:no-underline text-blue opacity-80 hover:opacity-100 focus:opacity-100',
        className
      )}
      onClick={() => setCopied(toCopy)}
    >
      {isCopied && (
        <div className="flex items-center space-x-1 whitespace-nowrap">
          <CheckCircleIcon width={16} height={16} />
          <Typography variant="xs" weight={700}>
            {i18n._(t`Copied`)}
          </Typography>
        </div>
      )}

      {!isCopied && (
        <div className="flex items-center gap-1">
          <DocumentDuplicateIcon width={16} height={16} />
          {children}
        </div>
      )}
    </div>
  )
}

export default CopyHelper
