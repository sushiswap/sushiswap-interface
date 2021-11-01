import React, { FC } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { TridentBody, TridentHeader } from 'layouts/Trident'
import { useSetRecoilState } from 'recoil'
import { currentStepAtom } from '../context/atoms'
import { CreateOracleOption } from './CreateOracleOption'
import { SelectAssetsWidget } from './SelectAssetsWidget'
import { SelectFeeTier } from './SelectFeeTier'
import { StepTwoContinueButton } from './StepTwoContinueButton'
import { StepHeader } from '../StepHeader'

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
        <StepTwoContinueButton />
      </TridentBody>
    </div>
  )
}
