import React, { FC } from 'react'
import { classNames } from '../../functions'
import { useAppDispatch } from '../../state/hooks'
import { setStrategy } from '../../state/inari/actions'
import { useDerivedInariState, useInariState } from '../../state/inari/hooks'

interface StrategySelectorProps {}

const StrategySelector: FC<StrategySelectorProps> = () => {
  const { strategy } = useInariState()
  const { strategies } = useDerivedInariState()
  const dispatch = useAppDispatch()

  return (
    <div className="flex flex-col gap-4 z-10 relative">
      {strategies?.map((v, index) => {
        return (
          <div
            key={index}
            onClick={() => dispatch(setStrategy(index))}
            className={classNames(
              index === strategy ? 'border-gradient-r-blue-pink-dark-800' : 'bg-dark-900',
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
