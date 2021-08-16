import Popover, { PopoverProps } from '../Popover'
import React, { ReactNode, useCallback, useState } from 'react'

interface TooltipProps extends Omit<PopoverProps, 'content'> {
  text: ReactNode
}

interface TooltipContentProps extends Omit<PopoverProps, 'content'> {
  content: ReactNode
}

export default function Tooltip({ text, ...rest }: TooltipProps) {
  return (
    <Popover
      content={
        <div className="w-[228px] px-2 py-1 font-medium bg-dark-700 border border-gray-600 rounded text-sm">{text}</div>
      }
      {...rest}
    />
  )
}

export function TooltipContent({ content, ...rest }: TooltipContentProps) {
  return <Popover content={<div className="w-64 py-[0.6rem] px-4 break-words">{content}</div>} {...rest} />
}

export function MouseoverTooltip({ children, ...rest }: Omit<TooltipProps, 'show'>) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])
  return (
    <Tooltip {...rest} show={show}>
      <div onMouseEnter={open} onMouseLeave={close}>
        {children}
      </div>
    </Tooltip>
  )
}

export function MouseoverTooltipContent({ content, children, ...rest }: Omit<TooltipContentProps, 'show'>) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])
  return (
    <TooltipContent {...rest} show={show} content={content}>
      <div
        style={{ display: 'inline-block', lineHeight: 0, padding: '0.25rem' }}
        onMouseEnter={open}
        onMouseLeave={close}
      >
        {children}
      </div>
    </TooltipContent>
  )
}
