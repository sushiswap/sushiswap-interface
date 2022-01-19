import React from 'react'

// @ts-ignore TYPE NEEDS FIXING
export default function Paper({ children, className, ...rest }): JSX.Element {
  return (
    <div className={`rounded ${className}`} {...rest}>
      {children}
    </div>
  )
}
