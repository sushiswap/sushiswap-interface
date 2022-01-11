import { Dialog, Transition } from '@headlessui/react'
import ModalAction, { ModalActionProps } from 'app/components/Modal/Action'
import ModalActions, { ModalActionsProps } from 'app/components/Modal/Actions'
import ModalBody, { ModalBodyProps } from 'app/components/Modal/Body'
import ModalContent, {
  BorderedModalContent,
  ModalContentBorderedProps,
  ModalContentProps,
} from 'app/components/Modal/Content'
import ModalError, { ModalActionErrorProps } from 'app/components/Modal/Error'
import ModalHeader, { ModalHeaderProps } from 'app/components/Modal/Header'
import SubmittedModalContent, { SubmittedModalContentProps } from 'app/components/Modal/SubmittedModalContent'
import { classNames } from 'app/functions'
import { cloneElement, FC, isValidElement, ReactNode, useCallback, useMemo, useState } from 'react'
import React, { Fragment } from 'react'

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
  Body: FC<ModalBodyProps>
  Actions: FC<ModalActionsProps>
  Content: FC<ModalContentProps>
  BorderedContent: FC<ModalContentBorderedProps>
  Header: FC<ModalHeaderProps>
  Action: FC<ModalActionProps>
  SubmittedModalContent: FC<SubmittedModalContentProps>
  Error: FC<ModalActionErrorProps>
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
  afterLeave?: () => void
  children?: React.ReactNode
  transparent?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
}

const HeadlessUiModalControlled: FC<ControlledModalProps> = ({
  isOpen,
  onDismiss,
  afterLeave,
  children,
  transparent = false,
  maxWidth = 'lg',
}) => {
  const isDesktop = useDesktopMediaQuery()

  return (
    <Transition appear show={isOpen} as={Fragment} afterLeave={afterLeave}>
      <Dialog as="div" className="fixed z-50 inset-0" onClose={onDismiss}>
        <div className="relative flex items-center justify-center block min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className={classNames(
                isDesktop ? 'backdrop-blur-[10px]  bg-[rgb(0,0,0,0.4)]' : ' bg-[rgb(0,0,0,0.8)]',
                'fixed inset-0 filter'
              )}
            />
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
            <div
              className={classNames(
                transparent ? '' : 'bg-gradient-radial from-purple/10 to-blue/10 border border-dark-800',
                isDesktop
                  ? `lg:max-w-${maxWidth} w-full backdrop-blur-[40px] backdrop-saturate-[180%]`
                  : 'w-[85vw] max-h-[85vh] overflow-y-auto mx-auto',
                'bg-dark-1000/80 inline-block align-bottom rounded-xl text-left overflow-hidden transform p-4'
              )}
            >
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

HeadlessUiModal.Controlled = HeadlessUiModalControlled
HeadlessUiModal.Header = ModalHeader
HeadlessUiModal.Body = ModalBody
HeadlessUiModal.Content = ModalContent
HeadlessUiModal.BorderedContent = BorderedModalContent
HeadlessUiModal.Actions = ModalActions
HeadlessUiModal.Action = ModalAction
HeadlessUiModal.Error = ModalError
HeadlessUiModal.SubmittedModalContent = SubmittedModalContent

export default HeadlessUiModal
