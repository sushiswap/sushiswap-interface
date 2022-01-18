import { Transition } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { FormSectionProps } from 'app/components/Form/FormSection'
import ProgressBar from 'app/components/ProgressBar'
import Typography from 'app/components/Typography'
import { classNames, formatNumber } from 'app/functions'
import React, { createContext, FC, Fragment, ReactElement, useCallback, useContext, useMemo, useState } from 'react'

export interface FormWizardProps {
  children: ReactElement<FormSectionProps>[]
  submitButton: ReactElement
}

interface WizardContext {
  hasPrev: boolean
  hasNext: boolean
  setNext(): void
  setPrev(): void
  index: number
}

const WizardContext = createContext<WizardContext>({
  setNext: () => {},
  setPrev: () => {},
  index: 0,
  hasPrev: true,
  hasNext: true,
})

const useWizardContext = () => useContext(WizardContext)

const FormWizard: FC<FormWizardProps> = ({ children, submitButton }) => {
  const { i18n } = useLingui()
  const [index, setIndex] = useState(0)
  const setNext = useCallback(() => setIndex((prevState) => prevState + 1), [])
  const setPrev = useCallback(() => setIndex((prevState) => prevState - 1), [])

  const hasPrev = useMemo(() => index > 0, [index])
  const hasNext = useMemo(() => index + 1 < children.length, [children.length, index])

  return (
    <div>
      <WizardContext.Provider
        value={useMemo(
          () => ({ index, setNext, setPrev, hasPrev, hasNext }),
          [index, setNext, setPrev, hasPrev, hasNext]
        )}
      >
        {React.Children.map(children, (child, _index) => {
          if (!React.isValidElement(child)) return

          return (
            <div className={classNames(index === _index ? '' : 'hidden', 'flex flex-col gap-8')}>
              <div className="flex justify-between items-center border-b-2 border-dark-700 pb-4">
                <div className="flex flex-col gap-1">
                  <Typography variant="xs" weight={700} className="text-secondary tracking-wider">
                    {i18n._(t`STEP: ${index + 1} OF ${children.length}`)}
                  </Typography>
                  {child.props.header}
                </div>
                <div className="w-40">
                  <ProgressBar progress={formatNumber((index + 1) / children.length)} />
                </div>
              </div>
              <Transition
                as={Fragment}
                unmount={false}
                show={index === _index}
                enter="ease-out duration-200 delay-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
              >
                <div className="max-h-[820px] h-[820px] overflow-auto">
                  <div className={`grid grid-cols-${child.props.columns || 6} gap-8`}>{child.props.children}</div>
                </div>
              </Transition>
              <div
                className={classNames(
                  hasPrev ? 'justify-between' : hasNext ? 'justify-end' : 'justify-start',
                  'flex items-center pt-10 border-t-2 border-dark-700'
                )}
              >
                {hasPrev && (
                  <div>
                    <Button variant="outlined" color="blue" onClick={setPrev} type="button">
                      {i18n._(t`Previous`)}
                    </Button>
                  </div>
                )}
                {hasNext && (
                  <div>
                    <Button variant="filled" color="blue" onClick={setNext} type="button">
                      {i18n._(t`Next`)}
                    </Button>
                  </div>
                )}
                {!hasNext && <div>{submitButton}</div>}
              </div>
            </div>
          )
        })}
      </WizardContext.Provider>
    </div>
  )
}

export default FormWizard
