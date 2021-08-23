import React, { FC } from 'react'
import { QuestionMarkCircleIcon, XIcon } from '@heroicons/react/solid'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import HeadlessUIModal from '../../../components/Modal/HeadlessUIModal'
import Typography from '../../../components/Typography'
import Button from '../../../components/Button'

const FixedRatioExplanationModal: FC = () => {
  const { i18n } = useLingui()

  return (
    <HeadlessUIModal
      trigger={
        <div className="flex items-center justify-center w-4 h-4 rounded cursor-pointer">
          <QuestionMarkCircleIcon className="w-4 h-4 text-high-emphesis" />
        </div>
      }
    >
      {({ setOpen }) => (
        <div className="flex flex-col h-full p-5 gap-8 bg-dark-900">
          <div className="flex flex-col flex-grow gap-8">
            <div className="flex justify-between">
              <Typography variant="h1" weight={700} className="text-high-emphesis">
                {i18n._(t`Fixed Ratio`)}
              </Typography>
              <div className="h-8 w-8 cursor-pointer" onClick={() => setOpen(false)}>
                <XIcon className="text-high-emphesis" />
              </div>
            </div>
          </div>
          <Button variant="outlined" className="border border-transparent border-gradient-r-blue-pink-dark-900">
            {i18n._(t`Learn more about Fixed Ratio`)}
          </Button>
        </div>
      )}
    </HeadlessUIModal>
  )
}

export default FixedRatioExplanationModal
