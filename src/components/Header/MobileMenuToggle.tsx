import { Popover } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React, { FC } from 'react'

interface MobileMenuToggleProps {
  isOpen: boolean
}

export const MobileMenuToggle: FC<MobileMenuToggleProps> = ({ isOpen }) => {
  const { i18n } = useLingui()

  return (
    <div className="flex -mr-2 sm:hidden">
      <Popover.Button className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-high-emphesis focus:outline-none">
        <span className="sr-only">{i18n._(t`Open main menu`)}</span>
        {isOpen ? (
          <svg
            className="block w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            className="block w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </Popover.Button>
    </div>
  )
}

export default MobileMenuToggle
