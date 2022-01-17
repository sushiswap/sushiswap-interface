import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react'
import { Children, cloneElement, ComponentProps, FC, isValidElement } from 'react'

import { classNames } from '../../functions'
import Typography from '../Typography'

const FILLED = {
  group: 'border border-dark-800 rounded p-0.5 bg-dark-900',
  option: {
    checked: (checked) => (checked ? 'border-transparent border-gradient-r-blue-pink-dark-900' : 'border-transparent'),
    default: 'py-1 rounded-lg border',
  },
}

const OUTLINED = {
  group: 'gap-2',
  option: {
    checked: (checked) => (checked ? 'border-dark-700 bg-gradient-to-r from-blue to-pink' : 'border-dark-700'),
    default: 'py-3 rounded border',
  },
}

const VARIANTS = {
  filled: FILLED,
  outlined: OUTLINED,
}

export type ToggleButtonVariant = 'outlined' | 'filled'

type Props = ComponentProps<typeof HeadlessRadioGroup> & {
  variant?: ToggleButtonVariant
}

type ToggleButtonGroup<P> = FC<P> & {
  Button: FC<ComponentProps<typeof HeadlessRadioGroup.Option>>
}

const ToggleButtonGroup: ToggleButtonGroup<Props> = ({ children, className = '', variant = 'filled', ...props }) => {
  const cols = Children.count(props.children)
  return (
    <HeadlessRadioGroup
      {...props}
      className={classNames(className, `grid-cols-${cols} grid grid-flow-col`, VARIANTS[variant].group)}
    >
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child, { variant })
        }

        return child
      })}
    </HeadlessRadioGroup>
  )
}

ToggleButtonGroup.Button = ({
  value,
  children,
  variant = 'filled',
  activeClassName,
  className,
}: ComponentProps<typeof HeadlessRadioGroup.Option>) => {
  return (
    <HeadlessRadioGroup.Option value={value} className="outline-none">
      {({ checked }) => (
        <div
          className={classNames(
            checked ? classNames(activeClassName, className) : className,
            'h-full flex items-center justify-center cursor-pointer focus:none',
            VARIANTS[variant].option.checked(checked),
            VARIANTS[variant].option.default
          )}
        >
          <Typography
            id={`radio-option-${value}`}
            className={classNames('text-center', checked ? 'text-high-emphesis' : 'text-secondary')}
            variant="sm"
            weight={700}
          >
            {children}
          </Typography>
        </div>
      )}
    </HeadlessRadioGroup.Option>
  )
}

export default ToggleButtonGroup
