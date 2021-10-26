import Logo from '../Logo'
import React from 'react'
import useHttpLocations from '../../hooks/useHttpLocations'

export default function ListLogo({ logoURI, size = '24px', alt }: { logoURI: string; size: string; alt?: string }) {
  const srcs: string[] = useHttpLocations(logoURI)

  return <Logo alt={alt} width={size} height={size} srcs={srcs} />
}
