import { useCallback, useEffect } from 'react'

import { PopupContent } from '../../state/application/actions'
import TransactionPopup from './TransactionPopup'
import { XIcon } from '@heroicons/react/outline'
import { animated, useSpring } from 'react-spring'
import styled from 'styled-components'
import { useRemovePopup } from '../../state/application/hooks'

export const Popup = styled.div`
  display: inline-block;
  width: 100%;
  padding: 1em;
  // background-color: ${({ theme }) => theme.bg1};
  position: relative;
  border-radius: 10px;
  padding: 20px;
  padding-right: 35px;
  overflow: hidden;

  // ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: 290px;
    &:not(:last-of-type) {
      margin-right: 20px;
    }
  `}
`

const AnimatedFader = animated(({ children, ...rest }) => (
  <div className="h-[3px] bg-dark-800 w-full">
    <div className="h-[3px] bg-gradient-to-r from-blue to-pink " {...rest}>
      {children}
    </div>
  </div>
))

export default function PopupItem({
  removeAfterMs,
  content,
  popKey,
}: {
  removeAfterMs: number | null
  content: PopupContent
  popKey: string
}) {
  const removePopup = useRemovePopup()
  const removeThisPopup = useCallback(() => removePopup(popKey), [popKey, removePopup])
  useEffect(() => {
    if (removeAfterMs === null) return undefined

    const timeout = setTimeout(() => {
      removeThisPopup()
    }, removeAfterMs)

    return () => {
      clearTimeout(timeout)
    }
  }, [removeAfterMs, removeThisPopup])

  let popupContent
  if ('txn' in content) {
    const {
      txn: { hash, success, summary },
    } = content
    popupContent = <TransactionPopup hash={hash} success={success} summary={summary} />
  }

  const faderStyle = useSpring({
    from: { width: '100%' },
    to: { width: '0%' },
    config: { duration: removeAfterMs ?? undefined },
  })

  return (
    <div className="mb-4">
      <div className="w-full relative rounded overflow-hidden bg-dark-700">
        <div className="flex flex-row p-4">
          {popupContent}
          <div className="hover:text-white cursor-pointer">
            <XIcon width={24} height={24} onClick={removeThisPopup} />
          </div>
        </div>
        {removeAfterMs !== null ? <AnimatedFader style={faderStyle} /> : null}
      </div>
    </div>
  )
}
