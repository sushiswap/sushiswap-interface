import { BookOpenIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Badge from 'app/components/Badge'
import QuestionHelper from 'app/components/QuestionHelper'
import useLimitOrders from 'app/hooks/useLimitOrders'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

const MyOrders: FC = () => {
  const { i18n } = useLingui()
  const { pending } = useLimitOrders()
  const router = useRouter()

  const content = (
    <QuestionHelper
      text={i18n._(t`Open orders`)}
      icon={<BookOpenIcon width={24} height={24} className="hover:text-white cursor-pointer" />}
    />
  )

  return (
    <div onClick={() => router.push('/open-order')}>
      {pending.totalOrders > 0 ? (
        <Badge color="blue" value={pending.totalOrders}>
          {content}
        </Badge>
      ) : (
        content
      )}
    </div>
  )
}

export default MyOrders
