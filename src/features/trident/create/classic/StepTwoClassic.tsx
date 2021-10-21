import React, { FC } from 'react'
import { TridentBody, TridentHeader } from '../../../../layouts/Trident'
import Typography from '../../../../components/Typography'
import { t } from '@lingui/macro'
import Button from '../../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import { useLingui } from '@lingui/react'
import { useSetRecoilState } from 'recoil'
import { currentStepAtom } from '../context/atoms'
import { SelectAssetsWidget } from './SelectAssetsWidget'
import { SelectFeeTier } from './SelectFeeTier'
import { CreateOracleOption } from './CreateOracleOption'
import { StepTwoContinueButton } from './StepTwoContinueButton'
import { MobileStepper } from '../MobileStepper'

export const StepTwoClassic: FC = () => {
  const { i18n } = useLingui()
  const setStep = useSetRecoilState(currentStepAtom)

  return (
    <div className="w-full">
      <TridentHeader maxWidth="full" pattern="bg-binary-pattern" className="!gap-2">
        <div className="flex gap-4 items-center">
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {i18n._(t`New Classic Pool`)}
          </Typography>
          <Button
            color="blue"
            variant="outlined"
            size="xs"
            className="pl-0 pr-3 rounded-full inline flex-shrink-0 h-6"
            startIcon={<ChevronLeftIcon width={24} height={24} />}
            onClick={() => setStep(1)}
          >
            {i18n._(t`Go Back`)}
          </Button>
        </div>
        <Typography variant="sm" weight={400}>
          {i18n._(t`Select your assets, a fee tier, and oracle creation`)}
        </Typography>
        <MobileStepper />
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
