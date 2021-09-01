import { Children, cloneElement, ComponentProps, isValidElement } from 'react'
import { Tab as HeadlessTab } from '@headlessui/react'
import { classNames } from '../../functions'
import Typography from '../Typography'

const Stepper = (props: ComponentProps<typeof HeadlessTab.Group>) => {
  return <HeadlessTab.Group {...props} />
}

const List = (props: ComponentProps<typeof HeadlessTab.List>) => {
  const count = Children.count(props.children)

  return (
    <HeadlessTab.List {...props} className="flex border-b border-dark-700">
      {Children.map(props.children, (child, index) => {
        if (isValidElement(child)) return cloneElement(child, { lastChild: count === index + 1 })
        return child
      })}
    </HeadlessTab.List>
  )
}

const Panels = (props: ComponentProps<typeof HeadlessTab.Panels>) => {
  return <HeadlessTab.Panels {...props} />
}

const Panel = (props: ComponentProps<typeof HeadlessTab.Panel>) => {
  return <HeadlessTab.Panel {...props} />
}

const Tab = ({ lastChild, ...props }: ComponentProps<typeof HeadlessTab>) => {
  return (
    <HeadlessTab {...props} className={lastChild ? 'flex-grow' : ''}>
      {({ selected }) => (
        <div
          className={classNames(
            'flex flex-row gap-3 items-center h-[52px] relative px-5',
            lastChild ? 'flex-grow' : ''
          )}
        >
          <div
            className={classNames(
              'rounded-full w-5 h-5 flex items-center justify-center',
              selected ? 'bg-blue' : 'bg-dark-700'
            )}
          >
            <Typography
              variant="xs"
              weight={700}
              className={classNames(selected ? 'text-high-emphesis' : 'text-secondary')}
            >
              1
            </Typography>
          </div>
          <Typography
            variant="xs"
            weight={700}
            className={classNames('uppercase', selected ? 'text-high-emphesis' : 'text-secondary')}
          >
            {props.children}
          </Typography>
          {!lastChild && (
            <div className="h-[52px] absolute flex items-center text-dark-700 bottom-[-2px] top-0 right-[-6px]">
              <svg
                width="7"
                height="52"
                viewBox="0 0 7 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="-ml-0"
              >
                <path d="M1 0V19.6585L6 26L1 32.3415V52" stroke="currentColor" />
              </svg>
            </div>
          )}

          {/*cant use border because the svg wouldn't be centered*/}
          {selected && <div className="h-[5px] w-full left-0 absolute bg-blue bottom-0" />}
        </div>
      )}
    </HeadlessTab>
  )
}

Stepper.List = List
Stepper.Panels = Panels
Stepper.Panel = Panel
Stepper.Tab = Tab
export default Stepper
