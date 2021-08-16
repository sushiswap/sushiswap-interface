import React, { FC } from 'react'
import HeadlessUIModal from '../../../components/Modal/HeadlessUIModal'
import { QuestionMarkCircleIcon, XIcon } from '@heroicons/react/solid'
import Typography from '../../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import DepositSettingsModal from './DepositSettingsModal'
import Button from '../../../components/Button'

const BalancedModeExplanationModal: FC = () => {
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
                What is Balance Mode?
              </Typography>
              <div className="h-8 w-8 cursor-pointer" onClick={() => setOpen(false)}>
                <XIcon className="text-high-emphesis" />
              </div>
            </div>
            <div className="flex justify-between rounded p-4 gap-5 bg-blue bg-opacity-25">
              <Typography weight={700} className="text-high-emphesis">
                {i18n._(t`You can toggle balance mode in Settings by tapping this icon.`)}
              </Typography>
              <DepositSettingsModal />
            </div>
            <div className="flex flex-col gap-6 px-2.5">
              <Typography variant="sm" weight={400} className="text-high-emphesis">
                {i18n._(t`Previously, adding and removing liquidity had to be done with equal amounts of all assets. With the Trident
            update, this is no longer mandatory.`)}
              </Typography>
              <Typography variant="lg" weight={700} className="text-high-emphesis">
                {i18n._(
                  t`Balanced Mode is an optional UI setting to maintain the traditional style of equal-value adds and removes.`
                )}
              </Typography>
            </div>
          </div>
          <div className="flex flex-col self-end px-2.5 gap-3">
            <Typography weight={400} className="text-blue">
              {i18n._(t`Why use Balance Mode?`)}
            </Typography>
            <Typography weight={400} className="text-high-emphesis">
              {i18n._(
                t`Lower price impacts. The closer to equilibrium you interact with a pool, the lower price impact there is on your investment.`
              )}
            </Typography>
          </div>
          <Button variant="outlined" className="border border-transparent border-gradient-r-blue-pink-dark-900">
            Learn more about Balance Mode
          </Button>
        </div>
      )}
    </HeadlessUIModal>
  )
}

export default BalancedModeExplanationModal
