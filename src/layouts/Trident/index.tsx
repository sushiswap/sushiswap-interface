import React, { FC } from 'react'
import Main from '../../components/Main'
import Popups from '../../components/Popups'
import Header from '../../components/Header'
import Breadcrumb from '../../features/trident/Breadcrumb'

interface ComponentProps {
  breadcrumbs: { label: string; slug: string }[]
}

const TridentLayout: FC<ComponentProps> = ({ children = [] }) => {
  return (
    <div className="z-0 flex flex-col items-center w-full h-screen">
      <Header />
      <Breadcrumb />
      <Main>{children}</Main>
      <Popups />
    </div>
  )
}

export default TridentLayout
