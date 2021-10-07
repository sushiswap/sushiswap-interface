import React, { createContext, ReactNode, RefObject, useContext, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'

interface BgContextProps {
  bottomOfEl: RefObject<HTMLDivElement>
}

const BackgroundContext = createContext<BgContextProps>({} as any)
export const useBackgroundRef = () => useContext(BackgroundContext)

interface BackgroundProps {
  pattern?: string
  children?: ReactNode
  bottomPadding?: number
}

const Background = ({ pattern, children, bottomPadding = 0 }: BackgroundProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && bgRef.current) {
      const bgDistanceFromTopOfPage = bgRef.current.getBoundingClientRect().top + window.scrollY
      const headerBottomDistanceFromTopOfPage = ref.current.getBoundingClientRect().bottom + window.scrollY
      bgRef.current.style.height = `${headerBottomDistanceFromTopOfPage - bgDistanceFromTopOfPage + bottomPadding}px`
    }
  }, [ref, bgRef, bottomPadding])

  return (
    <BackgroundContext.Provider value={{ bottomOfEl: ref }}>
      <div className="relative z-10">{children}</div>
      <div
        ref={bgRef}
        className={classNames(
          'absolute z-0 border-t border-dark-1000 pointer-events-none left-0 right-0 bg-dark-1000 -mt-5',
          pattern || 'bg-bubble-pattern'
        )}
      >
        <div className="w-full h-full bg-dark-900 bg-opacity-80" />
      </div>
    </BackgroundContext.Provider>
  )
}

export default Background
