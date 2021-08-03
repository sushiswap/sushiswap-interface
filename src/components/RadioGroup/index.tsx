import { ComponentProps } from 'react'
import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react'

const RadioGroup = HeadlessRadioGroup

// TODO THIS SEEMS TO TRIGGER AN INFINITE LOOP AND I HAVE NO IDEA WHY
RadioGroup.Label = (props: ComponentProps<typeof HeadlessRadioGroup.Label>) => {
  return <HeadlessRadioGroup.Label {...props} />
}

RadioGroup.Option = (props: ComponentProps<typeof HeadlessRadioGroup.Option>) => {
  return <HeadlessRadioGroup.Option {...props} classNames="bg-blue" />
}

export default RadioGroup
