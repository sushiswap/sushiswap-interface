import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CreatePoolReviewModal } from 'app/features/trident/create/CreatePoolReviewModal'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import React, { FC } from 'react'
import { useSetRecoilState } from 'recoil'

import { currentStepAtom } from '../context/atoms'
import { StepHeader } from '../StepHeader'
import { CreateOracleOption } from './CreateOracleOption'
import { SelectAssetsWidget } from './SelectAssetsWidget'
import { SelectFeeTier } from './SelectFeeTier'
import { SelectionContinueButton } from './SelectionContinueButton'

export const StepTwoClassic: FC = () => {
  const { i18n } = useLingui()
  const setStep = useSetRecoilState(currentStepAtom)

  return (
    <div className="w-full">
      <TridentHeader maxWidth="full" pattern="bg-binary-pattern" className="!gap-2">
        <StepHeader
          title={i18n._(t`New Classic Pool`)}
          subtitle={i18n._(t`Select your assets, a fee tier, and oracle creation`)}
          backOnClick={() => setStep(1)}
        />
      </TridentHeader>
      <TridentBody maxWidth="full" className="gap-12">
        <SelectAssetsWidget />
        <SelectFeeTier />
        <CreateOracleOption />
        <SelectionContinueButton />
        <CreatePoolReviewModal />
      </TridentBody>
    </div>
  )
}
