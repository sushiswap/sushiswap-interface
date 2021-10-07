import React, { FC } from 'react'
import Main from '../../components/Main'
import Popups from '../../components/Popups'
import Breadcrumb, { BreadcrumbItem } from '../../features/trident/Breadcrumb'
import Container from '../../components/Container'
import Header from '../../components/Header'
import classNames from 'classnames'

type HeaderBackground =
  | 'bg-bars-pattern'
  | 'bg-binary-pattern'
  | 'bg-bubble-pattern'
  | 'bg-dots-pattern'
  | 'bg-x-times-y-is-k'
  | 'bg-wavy-pattern'
  | 'bg-chevron-pattern'

interface TridentHeaderProps {
  className?: string
  pattern?: HeaderBackground
}

export const TridentHeader: FC<TridentHeaderProps> = ({ children, className, pattern }) => {
  return (
    <header
      className={classNames('relative w-full bg-opacity-80 flex flex-col items-center', pattern || 'bg-bubble-pattern')}
    >
      <div className="absolute w-full h-full bg-dark-900 bg-opacity-80 z-0" />
      <Container maxWidth="7xl" className={classNames('flex flex-col gap-5 z-[1] px-5 pt-5 pb-5', className)}>
        {children}
      </Container>
    </header>
  )
}

export const TridentBody: FC<{ className?: string }> = ({ children, className }) => {
  return (
    <Main>
      <Container maxWidth="7xl" className={classNames('flex flex-col gap-5 p-5 z-[1]', className)}>
        {children}
      </Container>
    </Main>
  )
}

interface TridentLayoutProps {
  breadcrumbs?: BreadcrumbItem[]
}

const TridentLayout: FC<TridentLayoutProps> = ({ children = [], breadcrumbs = [] }) => {
  return (
    <div className="flex flex-col items-center w-full h-screen">
      <div className="bg-dark-1000 w-full">
        <Header />
        <Breadcrumb breadcrumbs={breadcrumbs} />
        {children}
      </div>
      <Popups />
    </div>
  )
}

export default TridentLayout
