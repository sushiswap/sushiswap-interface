import { FC } from 'react'
import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  children?: React.ReactNode
}

const HeadlessUIModal: FC<ModalProps> = ({ isOpen, onDismiss, children }) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" static className="fixed z-10 inset-0 overflow-y-auto" open={isOpen} onClose={onDismiss}>
        <div className="relative flex items-center justify-center min-h-screen text-center block">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-40"
            leave="ease-in duration-100"
            leaveFrom="opacity-40"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 transition backdrop-filter backdrop-blur-[3px] backdrop-opacity-100">
              <div className="fixed inset-0 mb-[20vw] ml-auto bg-pink bg-opacity-40 w-[60vw] rounded-full z-0 filter blur-[400px] rounded-full" />
              <div className="fixed inset-0 mt-[20vw] mr-auto bg-blue bg-opacity-40 w-[60vw] rounded-full z-0 filter blur-[400px] rounded-full" />
            </Dialog.Overlay>
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block align-middle h-screen" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-40"
            leave="ease-in duration-100"
            leaveFrom="opacity-40"
            leaveTo="opacity-0"
          >
            <div className="inline-block align-bottom rounded-lg text-left overflow-hidden transform  sm:my-8 sm:align-middle max-w-sm md:max-w-3xl sm:w-full p-4 sm:p-6">
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default HeadlessUIModal
