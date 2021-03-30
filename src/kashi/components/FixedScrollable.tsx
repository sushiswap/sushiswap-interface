import React from 'react'

const FixedScrollable = ({ children, height = '28rem' }: any) => {
  return (
    <div className="overflow-y-auto" style={{ height: height }}>
      {children}
    </div>
  )
}

export default FixedScrollable
