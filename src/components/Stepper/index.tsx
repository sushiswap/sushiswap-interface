import { CheckIcon } from '@heroicons/react/solid'
import React from 'react'

import Typography from '../../components/Typography'
import { classNames } from '../../functions/styling'

export default function SplitPane({
  steps,
  active,
}: {
  steps: { heading: string; content: string }[]
  active: number
}): JSX.Element {
  return (
    <div className="lg:border-t lg:border-b lg:border-gray-500">
      <nav className="mx-auto" aria-label="Progress">
        <ol role="list" className="rounded-md overflow-hidden lg:flex lg:border-gray-500 lg:rounded-none">
          {steps.map((step, stepIdx) => (
            <li key={stepIdx} className="relative overflow-hidden lg:flex-1">
              <div
                className={classNames(
                  stepIdx === 0 ? 'border-b-0 rounded-t-md' : '',
                  stepIdx === steps.length - 1 ? 'border-t-0 rounded-b-md' : '',
                  'border border-gray-200 overflow-hidden lg:border-0'
                )}
              >
                {stepIdx < active ? (
                  <a>
                    <span
                      className="absolute top-0 left-0 w-1 h-full bg-transparent lg:w-full lg:h-1 lg:bottom-0 lg:top-auto"
                      aria-hidden="true"
                    />
                    <span className={classNames('pl-9 py-5 flex items-start text-sm font-medium')}>
                      <span className="flex-shrink-0">
                        <span className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-blue to-pink rounded-full">
                          <CheckIcon className="w-6 h-6 text-white" aria-hidden="true" />
                        </span>
                      </span>
                      <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
                        <Typography variant="xs" className="font-semibold tracking-wide uppercase">
                          {step.heading}
                        </Typography>
                        <Typography variant="sm">{step.content}</Typography>
                      </span>
                    </span>
                  </a>
                ) : stepIdx === active ? (
                  <div>
                    <span
                      className="absolute top-0 left-0 w-1 h-full bg-blue lg:w-full lg:h-1 lg:bottom-0 lg:top-auto"
                      aria-hidden="true"
                    />
                    <span className={classNames('pl-9 py-5 flex items-start text-sm font-medium')}>
                      <span className="flex-shrink-0">
                        <span className="w-10 h-10 flex items-center justify-center border-2 border-blue rounded-full">
                          <span className="text-blue">{stepIdx + 1}</span>
                        </span>
                      </span>
                      <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
                        <Typography variant="xs" className="font-semibold tracking-wide uppercase">
                          {step.heading}
                        </Typography>
                        <Typography variant="sm">{step.content}</Typography>
                      </span>
                    </span>
                  </div>
                ) : (
                  <div>
                    <span
                      className="absolute top-0 left-0 w-1 h-full bg-transparent lg:w-full lg:h-1 lg:bottom-0 lg:top-auto"
                      aria-hidden="true"
                    />
                    <span className={classNames('pl-9 py-5 flex items-start text-sm font-medium')}>
                      <span className="flex-shrink-0">
                        <span className="w-10 h-10 flex items-center justify-center border-2 border-gray-500 rounded-full">
                          <span className="text-gray-500">{stepIdx + 1}</span>
                        </span>
                      </span>
                      <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
                        <Typography variant="xs" className="font-semibold text-gray-500 tracking-wide uppercase">
                          {step.heading}
                        </Typography>
                        <Typography variant="sm" className="text-gray-500">
                          {step.content}
                        </Typography>
                      </span>
                    </span>
                  </div>
                )}

                {stepIdx !== 0 ? (
                  <>
                    {/* Separator */}
                    <div className="hidden absolute top-0 left-0 w-3 inset-0 lg:block" aria-hidden="true">
                      <svg
                        className="h-full w-full text-gray-500"
                        viewBox="0 0 12 82"
                        fill="none"
                        preserveAspectRatio="none"
                      >
                        <path d="M0.5 0V31L10.5 41L0.5 51V82" stroke="currentcolor" vectorEffect="non-scaling-stroke" />
                      </svg>
                    </div>
                  </>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
