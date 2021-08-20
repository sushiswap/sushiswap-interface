import React from 'react'

import { classNames } from '../../functions/styling'

export const Radio = React.memo(
  ({
    label,
    selected,
    onSelect,
    className,
    ...rest
  }: {
    label: string
    selected: boolean
    onSelect?: (string) => void
  } & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'as'>) => {
    return (
      <div
        className={classNames('flex flex-row items-center cursor-pointer', className)}
        {...rest}
        onClick={() => onSelect(label)}
      >
        <div className="border-2 border-white rounded-full w-[18px] h-[18px] mr-2">
          {selected && (
            <div className="bg-gradient-to-r from-[#0993EC] to-[#F338C3] rounded-full w-[12px] h-[12px] m-[1px]" />
          )}
        </div>
        <div className="text-lg text-white">{label}</div>
      </div>
    )
  }
)

Radio.displayName = 'Radio'

export default Radio
