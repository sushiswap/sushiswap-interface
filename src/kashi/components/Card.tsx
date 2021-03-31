import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'

export default function Card({
  header = undefined,
  backgroundImage = '',
  backgroundColor = 'rgb(34, 38, 54)',
  title = '',
  description = '',
  children,
  className,
  padding = undefined
}: any) {
  const theme = useContext(ThemeContext)
  return (
    <div
      className={`${className} h-full`}
      style={{
        borderRadius: '10px',
        // minHeight: '40rem',
        background: backgroundImage ? `url(${backgroundImage}), ${theme.extraDarkPurple}` : backgroundColor,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center bottom'
      }}
    >
      {header && <>{header}</>}
      <div className={`${padding ? padding : 'p-8'}`}>
        {title && <div className="font-semibold text-2xl mb-4">{title}</div>}
        {description && <div className="font-base text-base text-gray-400">{description}</div>}
        {children}
      </div>
    </div>
  )
}
