import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'components/Button'
import Typography from 'components/Typography'
import { TridentBody, TridentHeader } from 'layouts/Trident'
import React, { FC } from 'react'
import { useSetRecoilState } from 'recoil'

import { currentStepAtom } from '../context/atoms'
import { MobileStepper } from '../MobileStepper'
import { DepositAssets } from './DepositAssets'
import { SetAssetPrice } from './SetAssetPrice'

export const StepThreeClassic: FC = () => {
  const { i18n } = useLingui()
  const setStep = useSetRecoilState(currentStepAtom)

  return (
    <div className="w-full">
      <TridentHeader maxWidth="full" pattern="bg-binary-pattern" className="!gap-2">
        <div className="flex gap-4 items-center">
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {i18n._(t`Finalize your Classic Pool`)}
          </Typography>
          <Button
            color="blue"
            variant="outlined"
            size="xs"
            className="pl-0 pr-3 rounded-full inline flex-shrink-0 h-6"
            startIcon={<ChevronLeftIcon width={24} height={24} />}
            onClick={() => setStep(2)}
          >
            {i18n._(t`Go Back`)}
          </Button>
        </div>
        <Typography variant="sm" weight={400}>
          {i18n._(t`Set asset price, deposit tokens, and deploy your pool to Sushi`)}
        </Typography>
        <MobileStepper />
      </TridentHeader>
      <TridentBody maxWidth="full" className="gap-8">
        <SetAssetPrice />
        <DepositAssets />
      </TridentBody>
    </div>
  )
}
