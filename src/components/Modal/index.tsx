import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { isMobile } from 'react-device-detect'

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  minHeight?: number
  maxHeight?: number
  initialFocusRef?: React.RefObject<any>
  children?: React.ReactNode
  padding?: number
  maxWidth?: number
  className?: string
}

export default function Modal({
  isOpen,
  onDismiss,
  minHeight = 0,
  maxHeight = 90,
  initialFocusRef,
  children,
  padding = 5,
  maxWidth = 420,
}: ModalProps) {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" onClose={onDismiss} className="fixed inset-0 z-10 overflow-y-auto backdrop-blur-md">
          <Dialog.Overlay className="fixed inset-0" />
          <div className="flex items-center justify-center h-screen px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                className="transition-all transform"
                style={{ width: isMobile ? `100%` : '65vw', maxWidth: `${maxWidth}px` }}
              >
                <div className="w-full p-px rounded bg-gradient-to-r from-blue to-pink">
                  <div className="flex flex-col w-full h-full p-6 overflow-y-auto rounded bg-dark-900">
                    <div
                      style={{
                        minHeight: `${minHeight}vh`,
                        maxHeight: `${maxHeight}vh`,
                      }}
                      className="h-full"
                    >
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
