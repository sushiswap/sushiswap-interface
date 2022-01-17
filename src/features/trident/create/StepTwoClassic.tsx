import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CreatePoolReviewModal } from 'app/features/trident/create/CreatePoolReviewModal'
import { setCreateCurrentStep } from 'app/features/trident/create/createSlice'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useAppDispatch } from 'app/state/hooks'
import React, { FC } from 'react'

import { CreateOracleOption } from './CreateOracleOption'
import { SelectAssetsWidget } from './SelectAssetsWidget'
import { SelectFeeTier } from './SelectFeeTier'
import { SelectionContinueButton } from './SelectionContinueButton'
import { StepHeader } from './StepHeader'

export const StepTwoClassic: FC = () => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()

  return (
    <div className="w-full">
      <TridentHeader maxWidth="full" pattern="bg-binary" className="!gap-2">
        <StepHeader
          title={i18n._(t`New Classic Pool`)}
          subtitle={i18n._(t`Select your assets, a fee tier, and oracle creation`)}
          backOnClick={() => dispatch(setCreateCurrentStep(1))}
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
