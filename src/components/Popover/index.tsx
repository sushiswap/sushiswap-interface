import { Popover as HeadlessuiPopover } from '@headlessui/react'
import { Placement } from '@popperjs/core'
import { classNames } from 'app/functions'
import useInterval from 'app/hooks/useInterval'
import React, { useCallback, useState } from 'react'
import ReactDOM from 'react-dom'
import { usePopper } from 'react-popper'

export interface PopoverProps {
  content: React.ReactNode
  children: React.ReactNode
  placement?: Placement
  show?: boolean
  modifiers?: any[]
}

export default function Popover({ content, children, placement = 'auto', show, modifiers }: PopoverProps) {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)
  const { styles, update, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    strategy: 'fixed',
    modifiers: modifiers || [
      { name: 'offset', options: { offset: [0, 8] } },
      { name: 'arrow', options: { element: arrowElement } },
    ],
  })

  const updateCallback = useCallback(() => {
    update && update()
  }, [update])

  useInterval(updateCallback, show ? 100 : null)

  return (
    <HeadlessuiPopover>
      {({ open }) => (
        <>
          <HeadlessuiPopover.Button ref={setReferenceElement as any} className="flex">
            {children}
          </HeadlessuiPopover.Button>
          {(show ?? open) &&
            ReactDOM.createPortal(
              <HeadlessuiPopover.Panel
                static
                className="z-1000"
                ref={setPopperElement as any}
                style={styles.popper}
                {...attributes.popper}
              >
                {content}
                <div
                  className={classNames('w-2 h-2 z-50')}
                  ref={setArrowElement as any}
                  style={styles.arrow}
                  {...attributes.arrow}
                />
              </HeadlessuiPopover.Panel>,
              document.querySelector('#popover-portal')
            )}
        </>
      )}
    </HeadlessuiPopover>
  )
}
