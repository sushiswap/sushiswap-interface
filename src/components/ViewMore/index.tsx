import React from 'react'
import { PlusSmIcon } from '@heroicons/react/solid'

interface ViewMoreProps {
  text?: string
}

function Typography({ text = 'View More' }: React.HTMLAttributes<React.ReactHTML> & ViewMoreProps): JSX.Element {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-dark-800" />
      </div>
      <div className="relative flex justify-center">
        <button
          type="button"
          className="inline-flex items-center shadow-sm px-4 py-1.5 border border-dark-800 text-sm leading-5 font-medium rounded-full text-high-emphesis bg-dark-800 focus:outline-none "
        >
          <span>{text}</span>
          <PlusSmIcon className="-ml-1 mr-1.5 h-5 w-5 text-high-emphesis" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default Typography
