import Logo from '../Logo'
import React from 'react'
import useHttpLocations from '../../hooks/useHttpLocations'

export default function ListLogo({
  logoURI,
  style,
  size = '24px',
  alt,
}: {
  logoURI: string
  size?: string
  style?: React.CSSProperties
  alt?: string
}) {
  const srcs: string[] = useHttpLocations(logoURI)

  return <Logo alt={alt} width={size} height={size} srcs={srcs} style={style} />
}
