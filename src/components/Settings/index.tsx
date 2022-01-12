import { AdjustmentsIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Popover from 'app/components/Popover'
import QuestionHelper from 'app/components/QuestionHelper'
import Toggle from 'app/components/Toggle'
import TransactionSettings from 'app/components/TransactionSettings'
import Typography from 'app/components/Typography'
import { useToggleSettingsMenu } from 'app/state/application/hooks'
import { useExpertModeManager, useUserSingleHopOnly } from 'app/state/user/hooks'
import React, { FC, useState } from 'react'

interface SettingsTabProps {
  placeholderSlippage?: Percent
  trident?: boolean
}

const SettingsTab: FC<SettingsTabProps> = ({ placeholderSlippage, trident = false }) => {
  const { i18n } = useLingui()

  const toggle = useToggleSettingsMenu()
  const [expertMode, toggleExpertMode] = useExpertModeManager()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  const [showConfirmation, setShowConfirmation] = useState(false)

  return (
    <>
      <Popover
        placement="bottom-end"
        content={
          <div className="bg-dark-900 border border-dark-700 rounded w-80 shadow-lg">
            <div className="p-4 space-y-4">
              <Typography variant="sm" weight={700} className="text-high-emphesis">
                {i18n._(t`Transaction Settings`)}
              </Typography>

              <TransactionSettings placeholderSlippage={placeholderSlippage} trident={trident} />

              <Typography className="text-high-emphesis" weight={700}>
                {i18n._(t`Interface Settings`)}
              </Typography>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Typography variant="sm" className="text-primary">
                    {i18n._(t`Toggle Expert Mode`)}
                  </Typography>
                  <QuestionHelper
                    text={i18n._(
                      t`Bypasses confirmation modals and allows high slippage trades. Use at your own risk.`
                    )}
                  />
                </div>
                <Toggle
                  id="toggle-expert-mode-button"
                  isActive={expertMode}
                  toggle={
                    expertMode
                      ? () => {
                          toggleExpertMode()
                          setShowConfirmation(false)
                        }
                      : () => {
                          toggle()
                          setShowConfirmation(true)
                        }
                  }
                />
              </div>
              {!trident && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Typography variant="sm" className="text-primary">
                      {i18n._(t`Disable Multihops`)}
                    </Typography>
                    <QuestionHelper text={i18n._(t`Restricts swaps to direct pairs only.`)} />
                  </div>
                  <Toggle
                    id="toggle-disable-multihop-button"
                    isActive={singleHopOnly}
                    toggle={() => (singleHopOnly ? setSingleHopOnly(false) : setSingleHopOnly(true))}
                  />
                </div>
              )}
            </div>
          </div>
        }
      >
        <div className={'flex items-center justify-center w-10 h-10 rounded cursor-pointer'}>
          <AdjustmentsIcon className="w-[26px] h-[26px] transform rotate-90 hover:text-white" />
        </div>
      </Popover>
      <HeadlessUiModal.Controlled isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)} maxWidth="md">
        <div className="flex flex-col gap-4">
          <HeadlessUiModal.Header header={i18n._(t`Confirm`)} onClose={() => setShowConfirmation(false)} />
          <HeadlessUiModal.BorderedContent className="flex flex-col gap-3">
            <Typography weight={700}>
              {i18n._(t`Expert mode turns off the confirm transaction prompt and allows high slippage trades
                                that often result in bad rates and lost funds.`)}
            </Typography>
            <Typography variant="xs" weight={700} className="text-secondary">
              {i18n._(t`ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.`)}
            </Typography>
          </HeadlessUiModal.BorderedContent>
          <Button
            color="red"
            onClick={() => {
              toggleExpertMode()
              setShowConfirmation(false)
            }}
          >
            {i18n._(t`Enable Expert Mode`)}
          </Button>
        </div>
      </HeadlessUiModal.Controlled>
    </>
  )
}

export default SettingsTab
