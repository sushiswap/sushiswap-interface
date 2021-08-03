import { Switch as HeadlessUiSwitch } from '@headlessui/react'
import { ComponentProps, ReactNode } from 'react'

type SwitchProps = ComponentProps<typeof HeadlessUiSwitch> & {
  checkedIcon?: ReactNode
  uncheckedIcon?: ReactNode
}

const Switch = ({ checked, onChange, checkedIcon = '', uncheckedIcon = '' }: SwitchProps) => {
  return (
    <HeadlessUiSwitch
      checked={checked}
      onChange={onChange}
      className={`${checked ? 'bg-teal-900' : 'bg-teal-700'}
          flex items-center bg-dark-800 border border-dark-700 relative inline-flex flex-shrink-0 h-[36px] w-[65px] rounded-full cursor-pointer ease-in-out duration-200`}
    >
      <span
        aria-hidden="true"
        className={`${checked ? 'translate-x-[30px]' : 'translate-x-[2px]'}
            pointer-events-none inline-block h-[30px] w-[30px] rounded-full bg-high-emphesis shadow-md transform transition ease-in-out duration-200 flex items-center justify-center`}
      >
        {checked ? checkedIcon : uncheckedIcon}
      </span>
    </HeadlessUiSwitch>
  )
}

export default Switch
