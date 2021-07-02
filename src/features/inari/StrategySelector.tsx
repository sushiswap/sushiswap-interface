import React, { FC } from 'react'
import { classNames } from '../../functions'
import { useAppDispatch } from '../../state/hooks'
import { setStrategy } from '../../state/inari/actions'
import { INARI_STRATEGIES } from '../../state/inari/constants'
import { useInariState } from '../../state/inari/hooks'

interface StrategySelectorProps {}

const StrategySelector: FC<StrategySelectorProps> = () => {
  const { strategy } = useInariState()
  const dispatch = useAppDispatch()

  return (
    <div className="flex flex-col gap-4 z-10 relative">
      {Object.entries(INARI_STRATEGIES).map(([k, v]) => {
        return (
          <div
            key={k}
            onClick={() => dispatch(setStrategy(k))}
            className={classNames(
              k === strategy ? 'border-gradient-r-blue-pink-dark-800' : 'bg-dark-900',
              'cursor-pointer border border-transparent pl-5 py-2 rounded whitespace-nowrap w-full font-bold h-[48px] flex items-center text-sm'
            )}
          >
            {v.name}
          </div>
        )
      })}
    </div>
  )
}

export default StrategySelector
