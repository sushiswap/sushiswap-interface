import { PlusSmIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { FC, HTMLAttributes, ReactHTML, ReactNode } from 'react'

import Typography from '../Typography'

interface ViewMoreProps extends HTMLAttributes<ReactHTML> {
  text?: string
  onClick: () => void
  icon?: ReactNode
}

const ViewMore: FC<ViewMoreProps> = ({ text, onClick, icon = <PlusSmIcon /> }) => {
  const { i18n } = useLingui()
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-dark-800" />
      </div>
      <div className="relative flex justify-center">
        <button
          onClick={onClick}
          type="button"
          className="inline-flex gap-1 items-center shadow-sm pl-2.5 pr-1.5 py-px border border-dark-800 text-sm leading-5 font-medium rounded-full text-high-emphesis bg-dark-800 focus:outline-none "
        >
          <Typography variant="xs" className="text-high-emphesis">
            {text || i18n._(t`View More`)}
          </Typography>
          <div className="w-5 h-5 text-high-emphesis" aria-hidden="true">
            {icon}
          </div>
        </button>
      </div>
    </div>
  )
}

export default ViewMore
