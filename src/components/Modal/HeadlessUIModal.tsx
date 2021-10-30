import { Dialog, Transition } from '@headlessui/react'
import { cloneElement, FC, isValidElement, ReactNode, useCallback, useMemo, useState } from 'react'
import React, { Fragment } from 'react'

import { classNames } from '../../functions'
import useDesktopMediaQuery from '../../hooks/useDesktopMediaQuery'

interface TriggerProps {
  open: boolean
  setOpen: (x: boolean) => void
  onClick: () => void
}

interface Props {
  trigger?: (({ open, onClick, setOpen }: TriggerProps) => ReactNode) | ReactNode
}

type HeadlessUiModalType<P> = FC<P> & {
  Controlled: FC<ControlledModalProps>
}

const HeadlessUiModal: HeadlessUiModalType<Props> = ({ children: childrenProp, trigger: triggerProp }) => {
  const [open, setOpen] = useState(false)

  const onClick = useCallback(() => {
    setOpen(true)
  }, [])

  // If trigger is a function, render props
  // Else (default), check if element is valid and pass click handler
  const trigger = useMemo(
    () =>
      typeof triggerProp === 'function'
        ? triggerProp({ onClick, open, setOpen })
        : isValidElement(triggerProp)
        ? cloneElement(triggerProp, { onClick })
        : null,
    [onClick, open, triggerProp]
  )

  // If children is a function, render props
  // Else just render normally
  const children = useMemo(
    () => (typeof childrenProp === 'function' ? childrenProp({ onClick, open, setOpen }) : children),
    [onClick, open, childrenProp]
  )

  return (
    <>
      {trigger && trigger}
      <HeadlessUiModalControlled isOpen={open} onDismiss={() => setOpen(false)}>
        {children}
      </HeadlessUiModalControlled>
    </>
  )
}

interface ControlledModalProps {
  isOpen: boolean
  onDismiss: () => void
  children?: React.ReactNode
  className?: string
}

const HeadlessUiModalControlled: FC<ControlledModalProps> = ({ className, isOpen, onDismiss, children }) => {
  const isDesktop = useDesktopMediaQuery()

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={classNames('fixed z-10 inset-0 overflow-y-auto', isDesktop ? '' : 'bg-dark-900', className)}
        onClose={onDismiss}
      >
        {isDesktop ? (
          <div className="relative flex items-center justify-center min-h-screen text-center block">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 filter backdrop-blur-[10px] bg-[rgb(0,0,0,0.4)]" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="bg-dark-900 shadow-lg inline-block align-bottom rounded-lg text-left overflow-hidden transform">
                {children}
              </div>
            </Transition.Child>
          </div>
        ) : (
          <div className="w-full h-full">{children}</div>
        )}
      </Dialog>
    </Transition>
  )
}

HeadlessUiModal.Controlled = HeadlessUiModalControlled
export default HeadlessUiModal
