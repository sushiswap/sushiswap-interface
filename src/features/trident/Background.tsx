import React, { createContext, RefObject, useContext, useEffect, useRef } from 'react'

const HEADER_HEIGHT = 106

const BackgroundContext = createContext<RefObject<HTMLDivElement>>(null)
export const useBackgroundRef = () => useContext(BackgroundContext)

const Background = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && bgRef.current) {
      const { offsetTop } = ref.current
      bgRef.current.style.height = `${offsetTop + 20}px`
    }
  }, [ref, bgRef])

  return (
    <BackgroundContext.Provider value={ref}>
      <div
        ref={bgRef}
        style={{ top: HEADER_HEIGHT }}
        className={`absolute border-t border-dark-1000 h-full pointer-events-none w-full left-0 bg-dark-1000 bg-bubble-pattern`}
      >
        <div className="w-full h-full bg-dark-900 bg-opacity-80" />
      </div>
      {children}
    </BackgroundContext.Provider>
  )
}

export default Background
