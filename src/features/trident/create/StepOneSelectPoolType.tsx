import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'components/Button'
import Typography from 'components/Typography'
import { TridentBody, TridentHeader } from 'layouts/Trident'
import Link from 'next/link'
import React, { FC } from 'react'
import { useRecoilValue } from 'recoil'

import { PoolType } from '../types'
import { ClassicDescription } from './classic/ClassicDescription'
import { selectedPoolTypeAtom } from './context/atoms'
import { MobileStepper } from './MobileStepper'
import { PoolSelector } from './PoolSelector'

export const StepOneSelectPoolType: FC = () => {
  const { i18n } = useLingui()
  const poolSelected = useRecoilValue(selectedPoolTypeAtom)

  return (
    <div className="w-full">
      <TridentHeader maxWidth="full" pattern="bg-binary-pattern" className="!gap-2">
        <div className="flex gap-4 items-center">
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {i18n._(t`Create New Liquidity Pool`)}
          </Typography>
          <Button
            color="blue"
            variant="outlined"
            size="xs"
            className="pl-0 pr-3 rounded-full inline flex-shrink-0 h-6"
            startIcon={<ChevronLeftIcon width={24} height={24} />}
          >
            <Link href={`/trident/pools`}>{i18n._(t`Go Back`)}</Link>
          </Button>
        </div>
        <Typography variant="sm" weight={400}>
          {i18n._(t`Select a pool type, deposit assets, and create your pool on Sushi.`)}
        </Typography>
        <MobileStepper />
      </TridentHeader>
      <TridentBody maxWidth="full">
        <div className="grid lg:grid-cols-4 grid-cols-2 gap-3 select-none">
          <PoolSelector title="Classic" active={poolSelected === PoolType.Classic} />
          <PoolSelector title="Concentrated" active={poolSelected === PoolType.Concentrated} comingSoon />
          <PoolSelector title="Index" active={poolSelected === PoolType.Index} comingSoon />
          <PoolSelector title="Stable" active={poolSelected === PoolType.Stable} comingSoon />
        </div>

        {poolSelected === PoolType.Classic && <ClassicDescription />}
      </TridentBody>
    </div>
  )
}
