import { CheckCircle, Copy } from 'react-feather'
import React from 'react'
import useCopyClipboard from '../../hooks/useCopyClipboard'
import { classNames } from '../../functions'

export default function CopyHelper(props: { className?: string; toCopy: string; children?: React.ReactNode }): any {
  const [isCopied, setCopied] = useCopyClipboard()

  return (
    <div
      className={classNames(
        'flex items-center flex-shrink-0 space-x-1 no-underline cursor-pointer whitespace-nowrap hover:no-underline focus:no-underline active:no-underline text-blue opacity-80 hover:opacity-100 focus:opacity-100',
        props.className
      )}
      onClick={() => setCopied(props.toCopy)}
    >
      {isCopied && (
        <div className="flex items-center space-x-1 whitespace-nowrap">
          <CheckCircle size={'16'} />
          <div>Copied</div>
        </div>
      )}
      {!isCopied && (
        <>
          <Copy size={'16'} />
          {props.children}
        </>
      )}
    </div>
  )
}
