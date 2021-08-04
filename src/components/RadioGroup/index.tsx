import { ComponentProps } from 'react'
import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react'
import { classNames } from '../../functions'
import Typography from '../Typography'

const RadioGroup = (props: ComponentProps<typeof HeadlessRadioGroup>) => {
  return <HeadlessRadioGroup {...props} />
}

RadioGroup.Option = ({
  value,
  children,
  className = 'space-y-3.5',
}: ComponentProps<typeof HeadlessRadioGroup.Option>) => {
  return (
    <HeadlessRadioGroup.Option value={value} className={className}>
      {({ checked }) => (
        <>
          <div className="flex items-center text-sm cursor-pointer gap-3.5">
            <span
              className={classNames(
                checked ? '' : 'border border-dark-700 bg-dark-800',
                'h-6 w-6 rounded-full flex items-center justify-center'
              )}
              aria-hidden="true"
              {...(checked && {
                style: { background: 'linear-gradient(103.72deg, #0993EC -6.18%, #F338C3 100%)' },
              })}
            >
              {checked && <span className="rounded-full bg-white w-2.5 h-2.5" />}
            </span>
            <HeadlessRadioGroup.Label as="span">
              <Typography className="text-high-emphesis" weight={checked ? 700 : 400}>
                {children}
              </Typography>
            </HeadlessRadioGroup.Label>
          </div>
        </>
      )}
    </HeadlessRadioGroup.Option>
  )
}

export default RadioGroup
