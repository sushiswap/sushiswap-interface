import React, { Children, cloneElement, FC, isValidElement, createContext, useMemo, useContext } from 'react'
import { classNames } from '../../functions'
import Typography from '../Typography'
import { HorizontalLine } from '../HorizontalLine'

interface StepperProps {
  onChange: (x: number) => void
  value: number
  className?: string
}

type Stepper<P> = FC<P> & {
  Panel: FC<PanelProps>
  Tab: FC<TabProps>
  List: FC<ListProps>
  Panels: FC
}

const defaultContext = { onChange: () => undefined, value: 0 }
const StepperContext = createContext<{ onChange(index: number): void; value: number }>(defaultContext)
const useStepperContext = () => useContext(StepperContext)

const Stepper: Stepper<StepperProps> = ({ onChange, value, children, className = 'flex flex-col' }) => {
  return (
    <StepperContext.Provider
      value={useMemo(
        () => ({
          onChange,
          value,
        }),
        [onChange, value]
      )}
    >
      <div className={className}>{children}</div>
    </StepperContext.Provider>
  )
}

interface ListProps {
  tabs: { title: string; subtitle: string }[]
}

const List: FC<ListProps> = ({ tabs }) => {
  return (
    <div>
      <HorizontalLine />
      <div className="flex">
        {tabs.map(({ title, subtitle }, index) => (
          <Tab title={title} subtitle={subtitle} index={index} isLastChild={index === tabs.length - 1} key={index} />
        ))}
      </div>
      <HorizontalLine />
    </div>
  )
}

const Panels: FC = ({ children }) => {
  return (
    <div className="flex">
      {Children.map(children, (child, index) => {
        if (isValidElement(child)) return cloneElement(child, { index })
        return child
      })}
    </div>
  )
}

interface PanelProps {
  value?: number
  index?: number
}

const Panel: FC<PanelProps> = (props) => {
  const { value } = useStepperContext()
  const selected = value === props.index
  return selected ? <div className="flex flex-col flex-grow w-full">{props.children}</div> : <></>
}

interface TabProps {
  title: string
  subtitle: string
  index: number
  isLastChild: boolean
}

const Tab: FC<TabProps> = ({ title, subtitle, index, isLastChild }) => {
  const { value, onChange } = useStepperContext()
  const selected = index === value

  return (
    <div className="cursor-pointer flex-1" onClick={() => onChange(index)}>
      <div className="flex flex-row gap-3 items-center md:h-20 h-16 relative px-5">
        <div
          className={classNames(
            'rounded-full w-10 h-10 flex items-center justify-center border-2 flex-shrink-0',
            selected ? 'border-blue' : 'border-secondary'
          )}
        >
          <Typography
            variant="sm"
            weight={700}
            className={classNames(selected ? 'text-high-emphesis' : 'text-secondary')}
          >
            {index + 1}
          </Typography>
        </div>
        <div>
          <Typography
            variant="sm"
            weight={700}
            className={classNames('uppercase', selected ? 'text-high-emphesis' : 'text-secondary')}
          >
            {title}
          </Typography>
          <Typography
            variant="sm"
            weight={700}
            className={classNames('hidden md:block', selected ? 'currentColor' : 'text-secondary')}
          >
            {subtitle}
          </Typography>
        </div>
        {!isLastChild && (
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
    </div>
  )
}

Stepper.List = List
Stepper.Panels = Panels
Stepper.Panel = Panel
Stepper.Tab = Tab
export default Stepper
