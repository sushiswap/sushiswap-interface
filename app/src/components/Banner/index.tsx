import { FC } from 'react'
import { XIcon } from '@heroicons/react/outline'

const Banner: FC = () => (
    <div className="relative bg-purple w-full">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
            <div className="pr-16 sm:text-center sm:px-16">
                <p className="font-medium text-white">
                    <span className="md:hidden">We announced a new product!</span>
                    <span className="hidden md:inline">Big news! We're excited to announce a brand new product.</span>
                    <span className="block sm:ml-2 sm:inline-block">
                        <a href="#" className="text-white font-bold underline">
                            {' '}
                            Learn more <span aria-hidden="true">&rarr;</span>
                        </a>
                    </span>
                </p>
            </div>
            <div className="absolute inset-y-0 right-0 pt-1 pr-1 flex items-start sm:pt-1 sm:pr-2 sm:items-start">
                <button type="button" className="flex p-2 focus:outline-none">
                    <span className="sr-only">Dismiss</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
            </div>
        </div>
    </div>
)

export default Banner
