import React, { FC } from 'react'
import { InaryStrategy } from '../../pages/inari'
import { classNames } from '../../functions'

interface StrategySelectorProps {
  strategy: number
  strategies: InaryStrategy[]
  setStrategy: (x: number) => void
}

const StrategySelector: FC<StrategySelectorProps> = ({ strategies, strategy, setStrategy }) => {
  return (
    <div className="flex flex-col gap-4 z-10 relative">
      {strategies.map((el, index) => {
        return (
          <div
            key={index}
            onClick={() => setStrategy(index)}
            className={classNames(
              strategy === index ? 'border-gradient-r-blue-pink-dark-800' : 'bg-dark-900',
              'cursor-pointer border border-transparent pl-5 py-2 rounded whitespace-nowrap w-full font-bold h-[48px] flex items-center'
            )}
          >
            {el.name}
          </div>
        )
      })}
    </div>
  )
}

export default StrategySelector
