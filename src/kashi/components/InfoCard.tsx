import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'

export default function InfoCard({ backgroundImage, title, description }: any) {
  const theme = useContext(ThemeContext)
  return (
    <div
      className="h-full flex-col justify-between"
      style={{
        backgroundColor: theme.baseCard,
        background: `url(${backgroundImage}), ${theme.extraDarkPurple}`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center bottom',
        borderRadius: '20px'
      }}
    >
      <div className="p-5">
        <div className="font-semibold text-2xl pb-4">{title}</div>
        <div className="font-base text-base text-gray-400">{description}</div>
      </div>
    </div>
  )
}
