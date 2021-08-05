import { Children, ComponentProps } from 'react'
import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react'
import { classNames } from '../../functions'
import Typography from '../Typography'

const ToggleButtonGroup = ({ className = 'bg-dark-900', ...props }: ComponentProps<typeof HeadlessRadioGroup>) => {
  const cols = Children.count(props.children)
  return (
    <HeadlessRadioGroup
      {...props}
      className={classNames(className, `border border-dark-800 rounded p-0.5 grid grid-flow-col grid-cols-${cols}`)}
    />
  )
}

ToggleButtonGroup.Button = ({
  value,
  children,
  className = 'py-1',
}: ComponentProps<typeof HeadlessRadioGroup.Option>) => {
  return (
    <HeadlessRadioGroup.Option value={value} className="outline-none">
      {({ checked }) => (
        <div
          className={classNames(
            className,
            'rounded-lg border h-full flex items-center justify-center cursor-pointer focus:none',
            checked ? 'border-transparent border-gradient-r-blue-pink-dark-900' : 'border-transparent'
          )}
        >
          <Typography
            className={classNames('text-center', checked ? 'text-high-emphesis' : '')}
            variant="sm"
            weight={checked ? 700 : 400}
          >
            {children}
          </Typography>
        </div>
      )}
    </HeadlessRadioGroup.Option>
  )
}

export default ToggleButtonGroup
