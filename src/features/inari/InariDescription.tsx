import React, { FC } from 'react'
import Typography from '../../components/Typography'
import { useDerivedInariState } from '../../state/inari/hooks'

interface InariHeaderProps {}

const InariDescription: FC<InariHeaderProps> = () => {
  const { general } = useDerivedInariState()

  return (
    <div className="grid gap-2">
      <Typography variant="lg" className="text-high-emphesis" weight={700}>
        {general?.name}
      </Typography>
      <Typography>{general?.description}</Typography>
    </div>
  )
}

export default InariDescription
