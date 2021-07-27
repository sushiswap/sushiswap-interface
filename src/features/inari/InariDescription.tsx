import React, { FC } from 'react'
import Typography from '../../components/Typography'
import { useDerivedInariState } from '../../state/inari/hooks'

interface InariHeaderProps {}

const InariDescription: FC<InariHeaderProps> = () => {
  const { strategy } = useDerivedInariState()

  return (
    <div className="grid gap-2">
      {strategy && (
        <>
          <Typography variant="lg" className="text-high-emphesis" weight={700}>
            {strategy.name}
          </Typography>
          <Typography>{strategy.description}</Typography>
        </>
      )}
    </div>
  )
}

export default InariDescription
