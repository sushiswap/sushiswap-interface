import { AdjustmentsIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Modal from 'app/components/Modal'
import ModalHeader from 'app/components/ModalHeader'
import QuestionHelper from 'app/components/QuestionHelper'
import Toggle from 'app/components/Toggle'
import TransactionSettings from 'app/components/TransactionSettings'
import Typography from 'app/components/Typography'
import { useOnClickOutside } from 'app/hooks/useOnClickOutside'
import { useActiveWeb3React } from 'app/services/web3'
import { ApplicationModal } from 'app/state/application/actions'
import { useModalOpen, useToggleSettingsMenu } from 'app/state/application/hooks'
import { useExpertModeManager, useUserSingleHopOnly } from 'app/state/user/hooks'
import React, { FC, useRef, useState } from 'react'

interface SettingsTabProps {
  placeholderSlippage?: Percent
  tines?: boolean
}

const SettingsTab: FC<SettingsTabProps> = ({ placeholderSlippage, tines = false }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()

  const node = useRef<HTMLDivElement>(null)
  const open = useModalOpen(ApplicationModal.SETTINGS)
  const toggle = useToggleSettingsMenu()

  const [expertMode, toggleExpertMode] = useExpertModeManager()

  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()

  // show confirmation view before turning on
  const [showConfirmation, setShowConfirmation] = useState(false)

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <div className="relative flex" ref={node}>
      <div
        className="flex items-center justify-center w-8 h-8 rounded cursor-pointer"
        onClick={toggle}
        id="open-settings-dialog-button"
      >
        <AdjustmentsIcon className="w-[26px] h-[26px] transform rotate-90" />
      </div>
      {open && (
        <div className="absolute top-14 right-0 z-50 -mr-2.5 min-w-20 md:m-w-22 md:-mr-5 bg-dark-900 border border-dark-700 rounded w-80 shadow-lg">
          <div className="p-4 space-y-4">
            <Typography weight={700} className="text-high-emphesis">
              {i18n._(t`Transaction Settings`)}
            </Typography>

            <TransactionSettings placeholderSlippage={placeholderSlippage} tines={tines} />

            <Typography className="text-high-emphesis" weight={700}>
              {i18n._(t`Interface Settings`)}
            </Typography>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Typography variant="sm" className="text-primary">
                  {i18n._(t`Toggle Expert Mode`)}
                </Typography>
                <QuestionHelper
                  text={i18n._(t`Bypasses confirmation modals and allows high slippage trades. Use at your own risk.`)}
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
            {!tines && (
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
      )}

      <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)}>
        <div className="space-y-4">
          <ModalHeader title={i18n._(t`Are you sure?`)} onClose={() => setShowConfirmation(false)} />
          <Typography variant="lg">
            {i18n._(t`Expert mode turns off the confirm transaction prompt and allows high slippage trades
                                that often result in bad rates and lost funds.`)}
          </Typography>
          <Typography variant="sm" className="font-medium">
            {i18n._(t`ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.`)}
          </Typography>
          <Button
            color="red"
            size="lg"
            onClick={() => {
              // if (window.prompt(i18n._(t`Please type the word "confirm" to enable expert mode.`)) === 'confirm') {
              //   toggleExpertMode()
              //   setShowConfirmation(false)
              // }
              toggleExpertMode()
              setShowConfirmation(false)
            }}
          >
            <Typography variant="lg" id="confirm-expert-mode">
              {i18n._(t`Turn On Expert Mode`)}
            </Typography>
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default SettingsTab
