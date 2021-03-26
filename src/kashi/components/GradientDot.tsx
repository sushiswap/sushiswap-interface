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
          marginLeft: '0.5rem',
          background: `${gradientColor(percent)}`
        }}
      ></span>
    </>
  )
}

export default GradientDot
