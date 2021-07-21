import React, { FC, MouseEvent, useRef } from 'react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import useToggle from '../../hooks/useToggle'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'

interface NeonSelectProps {
  value
  children: React.ReactElement<NeonSelectItemProps> | React.ReactElement<NeonSelectItemProps>[]
}

const NeonSelect: FC<NeonSelectProps> = ({ value, children }) => {
  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <div className="relative" ref={node} onClick={toggle}>
      <div className="shadow-md z-[2] relative flex border border-dark-800 bg-dark-900 h-[38px] rounded-md divide-x divide-dark-800">
        <div className="text-sm text-primary flex items-center pl-3 min-w-[80px] font-medium">{value}</div>
        <div className="flex items-center justify-center w-9 font-bold text-primary">
          <ChevronDownIcon width={16} height={16} strokeWidth={2} />
        </div>
      </div>
      <div
        className={`z-[1] shadow-lg w-full absolute top-0 pt-10 py-1.5 ${
          open ? 'flex flex-col' : 'hidden'
        } bg-dark-800 rounded`}
      >
        {children}
      </div>
    </div>
  )
}

interface NeonSelectItemProps {
  onClick: (e: MouseEvent<HTMLDivElement>, idx: number | string) => void
  value: number | string
}

export const NeonSelectItem: FC<NeonSelectItemProps> = ({ onClick, value, children }) => {
  return (
    <div
      onClick={(e) => onClick(e, value)}
      className="text-primary flex w-full cursor-pointer hover:text-white px-3 py-1.5 text-md"
    >
      {children}
    </div>
  )
}

export default NeonSelect
