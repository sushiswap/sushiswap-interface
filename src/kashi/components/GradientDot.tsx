import React from 'react'
import { gradientColor } from 'utils'

const GradientDot = ({ percent }: any) => {
  return (
    <>
      <span
        style={{
          display: 'block',
          height: '0.5rem',
          width: '0.5rem',
          borderRadius: '9999px',
          background: `${gradientColor(percent)}`
        }}
      ></span>
    </>
  )
}

export default GradientDot
