import Container, { MaxWidth } from 'app/components/Container'
import Footer from 'app/components/Footer'
import Header from 'app/components/Header'
import Main from 'app/components/Main'
import Popups from 'app/components/Popups'
import { classNames } from 'app/functions'
import React, { FC, ReactNode } from 'react'

interface MisoHeaderProps extends React.HTMLProps<HTMLHeadElement> {
  className?: string
  pattern?: string
  maxWidth?: MaxWidth
  condensed?: boolean
  breadcrumb?: ReactNode
}

export const MisoHeader: FC<MisoHeaderProps> = ({
  children,
  breadcrumb,
  className,
  maxWidth = '7xl',
  condensed,
  ...props
}) => {
  return (
    <header
      {...props}
      className={classNames('relative w-full bg-opacity-80 flex flex-col items-center shadow-md', className)}
    >
      <Container
        maxWidth={maxWidth}
        className={classNames(
          'flex flex-col gap-5 z-[1] py-10 px-5 lg:px-6',
          condensed && 'py-5',
          breadcrumb ? '!pt-4' : ''
        )}
      >
        {breadcrumb}
        {children}
      </Container>
    </header>
  )
}

interface MisoBodyProps {
  className?: string
  maxWidth?: MaxWidth
}

export const MisoBody: FC<MisoBodyProps> = ({ children, className, maxWidth = '7xl' }) => {
  return (
    <Main>
      <Container maxWidth={maxWidth} className={classNames('flex flex-col gap-10 py-10 px-5 lg:px-6 z-[1]', className)}>
        {children}
      </Container>
    </Main>
  )
}

const MisoLayout: FC = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col items-center w-full flex flex-grow">
        <div className="w-full flex-grow flex flex-col">{children}</div>
        <Popups />
      </div>
      <Footer />
    </div>
  )
}

export default MisoLayout
