import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Link from 'next/link'
import React, { FC } from 'react'

import Button from '../../../components/Button'
import Typography from '../../../components/Typography'
import { MobileStepper } from './MobileStepper'

interface StepHeaderProps {
  title: string
  subtitle: string
  backOnClick?: () => void
  backHref?: string
}

export const StepHeader: FC<StepHeaderProps> = ({ title, subtitle, backOnClick, backHref }) => {
  if ((backOnClick && backHref) || (!backOnClick && !backHref)) throw Error('Pass one or the other')

  const { i18n } = useLingui()

  return (
    <>
      <div>
        <Button
          color="blue"
          variant="outlined"
          size="xs"
          onClick={backOnClick}
          className="flex-shrink-0 inline h-6 pl-0 pr-3 rounded-full"
          startIcon={<ChevronLeftIcon width={24} height={24} />}
        >
          {backHref ? <Link href={backHref}>{i18n._(t`Go Back`)}</Link> : i18n._(t`Go Back`)}
        </Button>
      </div>
      <Typography variant="h2" className="text-high-emphesis" weight={700}>
        {title}
      </Typography>
      <Typography variant="sm" weight={400}>
        {subtitle}
      </Typography>
      <MobileStepper />
    </>
  )
}
