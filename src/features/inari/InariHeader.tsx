import React, { FC } from 'react'
import Typography from '../../components/Typography'
import Button from '../../components/Button'
import { t } from '@lingui/macro'
import { InaryStrategy } from '../../pages/inari'
import { useLingui } from '@lingui/react'

interface InariHeaderProps {
  strategy: InaryStrategy
}

const InariHeader: FC<InariHeaderProps> = ({ strategy }) => {
  const { i18n } = useLingui()
  return (
    <>
      <Typography variant="lg" className="text-high-emphesis" weight={700}>
        {strategy.name}
      </Typography>
      <Typography>{strategy.description}</Typography>
      <div className="flex gap-8">
        <Button variant="link" color="blue" size="none" className="underline">
          {i18n._(t`What is BentoBox?`)}
        </Button>
        <Button variant="link" color="blue" size="none" className="underline">
          {i18n._(t`What is Kashi?`)}
        </Button>
      </div>
    </>
  )
}

export default InariHeader
