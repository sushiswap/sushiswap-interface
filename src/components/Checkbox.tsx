import React from 'react'
import { CheckIcon } from '@heroicons/react/solid'

export type Color = 'pink' | 'blue'

const COLOR = {
  pink: 'checked:bg-pink checked:border-transparent focus:ring-pink',
  blue: 'checked:bg-blue checked:border-transparent focus:ring-blue',
}

export interface CheckboxProps {
  color: Color
  set?: (value: boolean) => void
}

function Checkbox({
  color,
  set,
  className = '',
  checked,
  ...rest
}: CheckboxProps & React.InputHTMLAttributes<HTMLInputElement>): JSX.Element {
  return (
    <div className="flex relative items-center justify-center">
      <input
        type="checkbox"
        onChange={(event) => (set ? set(event.target.checked) : null)}
        className={`border border-dark-700 checked:bg-gradient-to-r checked:from-blue checked:to-pink checked:border-white cursor-pointer appearance-none h-5 w-5 rounded-[4px] bg-dark-900 disabled:bg-dark-1000 disabled:border-dark-800 ${COLOR[color]} ${className}`}
        checked={checked}
        {...rest}
      />
      {checked && (
        <div className="absolute pointer-events-none">
          <CheckIcon width={20} height={20} className="text-white" />
        </div>
      )}
    </div>
  )
}

export default Checkbox
