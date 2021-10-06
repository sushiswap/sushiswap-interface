import { Children, cloneElement, FC, isValidElement, createContext, useMemo, useContext } from 'react'
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
  List: FC
  Panels: FC
}

const StepperContext = createContext<{ onChange(index: number): void; value: number }>(null)
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

const List: FC = ({ children }) => {
  const count = Children.count(children)

  return (
    <div className="flex">
      {Children.map(children, (child, index) => {
        if (isValidElement(child)) return cloneElement(child, { lastChild: count === index + 1, index })
        return child
      })}
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
  lastChild?: boolean
  index?: number
}

const Tab: FC<TabProps> = ({ lastChild, ...props }) => {
  const { value, onChange } = useStepperContext()
  const selected = props.index === value

  return (
    <div className={classNames('cursor-pointer', lastChild ? 'flex-grow' : '')} onClick={() => onChange(props.index)}>
      <div
        className={classNames('flex flex-row gap-3 items-center h-[52px] relative px-5', lastChild ? 'flex-grow' : '')}
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
            {props.index + 1}
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
    </div>
  )
}

Stepper.List = List
Stepper.Panels = Panels
Stepper.Panel = Panel
Stepper.Tab = Tab
export default Stepper
