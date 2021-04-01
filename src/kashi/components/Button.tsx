import React from 'react'

function Button({ className, children, ...rest }: any): JSX.Element {
  return (
    <button className={`${className}`} {...rest}>
      {children}
    </button>
  )
}

export default Button
