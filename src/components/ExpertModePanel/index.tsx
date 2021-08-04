import { FC } from 'react'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { XCircleIcon } from '@heroicons/react/outline'

interface ExpertModePanelProps {
  active: boolean
  onClose: () => void
}

const ExpertModePanel: FC<ExpertModePanelProps> = ({ active, children, onClose }) => {
  const { i18n } = useLingui()
  if (!active) return <>{children}</>

  return (
    <div className="">
      <div className="h-[34px] flex justify-end">
        <div className="bg-dark-800 rounded-tr rounded-tl-full gap-6 flex items-center -mb-2 relative justify-between pr-3 pl-8">
          <span className="font-bold uppercase tracking-widest text-sm mb-1">{i18n._(t`Expert Mode`)}</span>
          <div onClick={onClose} className="cursor-pointer mb-1">
            <XCircleIcon width={20} height={20} className="hover:text-high-emphesis" />
          </div>
        </div>
      </div>
      <div className="border border-[2px] border-gray-800 rounded bg-dark-900">{children}</div>
    </div>
  )
}

export default ExpertModePanel
