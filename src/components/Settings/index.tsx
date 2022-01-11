import { AdjustmentsIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import ModalHeader from 'app/components/ModalHeader'
import Popover from 'app/components/Popover'
import QuestionHelper from 'app/components/QuestionHelper'
import Toggle from 'app/components/Toggle'
import TransactionSettings from 'app/components/TransactionSettings'
import Typography from 'app/components/Typography'
import { useOnClickOutside } from 'app/hooks/useOnClickOutside'
import { useActiveWeb3React } from 'app/services/web3'
import { useToggleSettingsMenu } from 'app/state/application/hooks'
import { useExpertModeManager, useUserOpenMev, useUserSingleHopOnly } from 'app/state/user/hooks'
import React, { FC, useRef, useState } from 'react'

import { OPENMEV_ENABLED, OPENMEV_SUPPORTED_NETWORKS } from '../../config/openmev'

interface SettingsTabProps {
  placeholderSlippage?: Percent
  trident?: boolean
}

const SettingsTab: FC<SettingsTabProps> = ({ placeholderSlippage, trident = false }) => {
  const { i18n } = useLingui()

  const { chainId } = useActiveWeb3React()

  const node = useRef<HTMLDivElement>(null)

  const toggle = useToggleSettingsMenu()
  const [expertMode, toggleExpertMode] = useExpertModeManager()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  const [showConfirmation, setShowConfirmation] = useState(false)

  const [userUseOpenMev, setUserUseOpenMev] = useUserOpenMev()

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <>
      <Popover
        placement="bottom-end"
        content={
          <div className="w-80 rounded border shadow-lg bg-dark-900 border-dark-700">
            <div className="p-4 space-y-4">
              <Typography weight={700} className="text-high-emphesis">
                {i18n._(t`Transaction Settings`)}
              </Typography>

              <TransactionSettings placeholderSlippage={placeholderSlippage} trident={trident} />

              <Typography className="text-high-emphesis" weight={700}>
                {i18n._(t`Interface Settings`)}
              </Typography>

              <div className="flex justify-between items-center">
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
                <div className="flex justify-between items-center">
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
            {OPENMEV_ENABLED && OPENMEV_SUPPORTED_NETWORKS.includes(chainId) && (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Typography variant="sm" className="text-primary">
                    {i18n._(t`OpenMEV Gas Refunder`)}
                  </Typography>
                  <QuestionHelper text={i18n._(t`OpenMEV refunds up to 95% of transaction costs in 35 blocks.`)} />
                </div>
                <Toggle
                  id="toggle-use-openmev"
                  isActive={userUseOpenMev}
                  toggle={() => (userUseOpenMev ? setUserUseOpenMev(false) : setUserUseOpenMev(true))}
                />
              </div>
            )}
          </div>
        }
      >
        <div className={'flex justify-center items-center w-10 h-10 rounded cursor-pointer'}>
          <AdjustmentsIcon className="w-[26px] h-[26px] transform rotate-90 hover:text-white" />
        </div>
      </Popover>
      <HeadlessUiModal.Controlled isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)}>
        <div className="p-6 space-y-4">
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
              toggleExpertMode()
              setShowConfirmation(false)
            }}
          >
            <Typography variant="lg" id="confirm-expert-mode">
              {i18n._(t`Turn On Expert Mode`)}
            </Typography>
          </Button>
        </div>
      </HeadlessUiModal.Controlled>
    </>
  )
}

export default SettingsTab
