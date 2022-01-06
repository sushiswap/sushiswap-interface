import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import React, { FC } from 'react'
import { useSetRecoilState } from 'recoil'

import { currentStepAtom } from '../context/atoms'
import { SushiWethExample } from './SushiWethExample'

export const ClassicDescription: FC = () => {
  const { i18n } = useLingui()
  const setCurrentStep = useSetRecoilState(currentStepAtom)

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Typography variant="h3" weight={700} className="text-high-emphesis">
          {i18n._(t`Classic`)}
        </Typography>
        <div>
          {i18n._(
            t`The original and most common type of pool, with two assets deposited in roughly equal value amounts.`
          )}
        </div>
      </div>
      <div>
        <div>{i18n._(t`Example`)}</div>
        <SushiWethExample />
      </div>
      <Button
        id="btn-classic-continue"
        className="w-72"
        color="gradient"
        variant="filled"
        onClick={() => setCurrentStep(2)}
      >
        {i18n._(t`Continue`)}
      </Button>
    </div>
  )
}
