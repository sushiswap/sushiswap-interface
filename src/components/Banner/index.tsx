import { useState } from 'react'
import { FC } from 'react'
import { XIcon } from '@heroicons/react/outline'

const Banner: FC = () => {
  const [enabled, setEnabled] = useState(true)
  return (
    <>
      {enabled ? (
        <div className="relative w-full bg-purple bg-opacity-20">
          <div className="px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="pr-16 sm:text-center sm:px-16">
              <p className="font-medium text-white">
                <span className="md:hidden">You need a &apos;Dona</span>
                <span className="hidden md:inline">You need a &apos;Dona - End of Summer Sellathon</span>
                <span className="block sm:ml-2 sm:inline-block">
                  <a
                    href="https://miso.sushi.com/auctions/0xC2704dEc22e552164Dee240B20b840Ea379B878E"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-white underline"
                  >
                    {' '}
                    Learn more on Miso<span aria-hidden="true">&rarr;</span>
                  </a>
                </span>
              </p>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
              <button type="button" className="flex p-2 focus:outline-none" onClick={() => setEnabled(false)}>
                <span className="sr-only">Dismiss</span>
                <XIcon className="w-6 h-6 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Banner
