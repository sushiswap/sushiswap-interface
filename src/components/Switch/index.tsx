import { Switch as HeadlessUiSwitch } from '@headlessui/react'
import { ComponentProps, ReactNode } from 'react'

import { classNames } from '../../functions'

type SwitchColor = 'default' | 'gradient'

type SwitchProps = ComponentProps<typeof HeadlessUiSwitch> & {
  checkedIcon?: ReactNode
  uncheckedIcon?: ReactNode
  color?: SwitchColor
  id?: string
}

const COLOR = {
  default: (checked) => (checked ? 'bg-high-emphesis' : 'bg-high-emphesis'),
  gradient: (checked) => (checked ? 'bg-gradient-to-r from-blue to-pink' : 'bg-dark-700'),
}

const Switch = ({
  checked,
  onChange,
  checkedIcon = '',
  uncheckedIcon = '',
  color = 'default',
  id = '',
}: SwitchProps) => {
  return (
    <HeadlessUiSwitch
      checked={checked}
      onChange={onChange}
      className={classNames(
        checked ? 'bg-teal-900' : 'bg-teal-700',
        `flex items-center bg-dark-800 border border-dark-700 relative inline-flex flex-shrink-0 h-[36px] w-[65px] rounded-full cursor-pointer ease-in-out duration-200 ${id}`
      )}
    >
      <span
        id={id}
        className={classNames(
          checked ? 'translate-x-[30px]' : 'translate-x-[2px]',
          COLOR[color](checked),
          'transition-colors transition-transform pointer-events-none h-[30px] w-[30px] p-1 rounded-full shadow-md ease-in-out duration-200 inline-flex items-center justify-center'
        )}
      >
        {checked ? checkedIcon : uncheckedIcon}
      </span>
    </HeadlessUiSwitch>
  )
}

export default Switch
