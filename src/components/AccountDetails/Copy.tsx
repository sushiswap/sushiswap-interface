import { CheckCircle, Copy } from 'react-feather'
import React from 'react'
import useCopyClipboard from '../../hooks/useCopyClipboard'

export default function CopyHelper(props: { toCopy: string; children?: React.ReactNode }): any {
  const [isCopied, setCopied] = useCopyClipboard()

  return (
    <div
      className="flex items-center flex-shrink-0 p-2 space-x-1 no-underline cursor-pointer text-baseline md:p-3 whitespace-nowrap hover:no-underline focus:no-underline active:no-underline text-blue opacity-80 hover:opacity-100 focus:opacity-100"
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
