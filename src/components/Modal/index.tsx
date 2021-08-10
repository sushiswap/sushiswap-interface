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
          <Dialog.Overlay className="fixed inset-0 cursor-pointer" />
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
                style={{ width: isMobile ? `100vw` : '65vw', maxWidth: `${maxWidth}px` }}
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

      {/* <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={onDismiss}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Payment successful
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Your payment has been successfully submitted. We’ve sent
                    your an email with all of the details of your order.
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={onDismiss}
                  >
                    Got it, thanks!
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition> */}
    </>
  )
}
