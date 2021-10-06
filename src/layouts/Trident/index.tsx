import React, { FC } from 'react'
import Main from '../../components/Main'
import Popups from '../../components/Popups'
import Header from '../../components/Header'
import Breadcrumb, { BreadcrumbItem } from '../../features/trident/Breadcrumb'
import Container from '../../components/Container'
import { classNames } from '../../functions'

interface ComponentProps {
  breadcrumbs?: BreadcrumbItem[]
  headerBg?: string
  headerHeight?: string
}

const TridentLayout: FC<ComponentProps> = ({
  children = [],
  headerBg = 'bg-dots-pattern',
  headerHeight = 'h-40',
  breadcrumbs = [],
}) => {
  return (
    <div className="z-0 flex flex-col items-center w-full h-screen">
      <Header />
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <div className="relative w-full">
        <Main>
          <div
            className={classNames(
              headerHeight,
              'z-[0] pointer-events-none bg-dark-900 w-full absolute left-0 right-0 top-0'
            )}
          >
            <div className={classNames(headerBg, 'w-full h-full opacity-25')} />
          </div>
          <Container maxWidth="7xl" className="flex flex-col gap-5 p-5 z-[1]">
            {children}
          </Container>
        </Main>
      </div>
      <Popups />
    </div>
  )
}

export default TridentLayout
