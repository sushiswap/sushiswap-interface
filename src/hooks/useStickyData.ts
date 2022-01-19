import { useRef } from 'react'

// @ts-ignore TYPE NEEDS FIXING
function useStickyData(value) {
  const val = useRef()
  if (value !== undefined) val.current = value
  return val.current
}

export default useStickyData
