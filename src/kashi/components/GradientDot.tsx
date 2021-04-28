import React from 'react'
import { gradientColor, gradientColorAsc } from 'utils'

const GradientDot = ({ percent, desc = true }: any) => {
    return (
        <>
            <span
                style={{
                    display: 'block',
                    height: '0.5rem',
                    width: '0.5rem',
                    borderRadius: '9999px',
                    marginLeft: '0.5rem',
                    background: `${desc ? gradientColor(percent) : gradientColorAsc(percent)}`
                }}
            ></span>
        </>
    )
}

export default GradientDot
