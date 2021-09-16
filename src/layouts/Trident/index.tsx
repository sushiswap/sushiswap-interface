import React, { FC } from 'react'
import Main from '../../components/Main'
import Breadcrumb from '../../components/Breadcrumb'
import Popups from '../../components/Popups'

interface ComponentProps {
  breadcrumbs: { label: string; slug: string }[]
}

const TridentLayout: FC<ComponentProps> = ({ children, breadcrumbs = [] }) => {
  return (
    <div className="z-0 flex flex-col items-center w-full h-screen">
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <Main>{children}</Main>
      <Popups />
    </div>
  )
}

export default TridentLayout
