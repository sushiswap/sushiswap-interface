import React, { FC } from 'react'
import { InaryStrategy } from '../../pages/inari'
import Typography from '../../components/Typography'
import { ArrowRightIcon } from '@heroicons/react/solid'

interface StrategyStepDisplayProps {
  strategy: InaryStrategy
}

const StrategyStepDisplay: FC<StrategyStepDisplayProps> = ({ strategy }) => {
  return (
    <div className="flex gap-4 items-center text-high-emphesis px-2">
      {strategy.steps
        .map<React.ReactNode>((el) => (
          <Typography weight={700} variant="lg" key={el}>
            {el}
          </Typography>
        ))
        .reduce(
          (acc, x) =>
            acc === null ? (
              x
            ) : (
              <>
                {acc}{' '}
                <div className="rounded-full p-1 bg-dark-800">
                  <ArrowRightIcon width={16} height={16} />
                </div>{' '}
                {x}
              </>
            ),
          null
        )}
    </div>
  )
}

export default StrategyStepDisplay
