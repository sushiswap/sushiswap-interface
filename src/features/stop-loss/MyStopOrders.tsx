import { BookOpenIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Badge from 'app/components/Badge'
import QuestionHelper from 'app/components/QuestionHelper'
import useStopLossOrders from 'app/features/stop-loss/useStopLossOrders'
import Link from 'next/link'
import React, { FC } from 'react'

const MyStopOrders: FC = () => {
  const { i18n } = useLingui()
  const { pending } = useStopLossOrders()

  const content = (
    <QuestionHelper
      text={i18n._(t`Open orders`)}
      icon={<BookOpenIcon width={24} height={24} className="cursor-pointer hover:text-white" />}
    />
  )

  return (
    <Link href="/stop-loss/open">
      <a>
        {pending.allData.length > 0 ? (
          <Badge color="blue" value={pending.allData.length}>
            {content}
          </Badge>
        ) : (
          content
        )}
      </a>
    </Link>
  )
}

export default MyStopOrders
