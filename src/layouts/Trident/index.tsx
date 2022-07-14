import Background, { BackgroundVariant } from 'app/components/Background'
import Container, { MaxWidth } from 'app/components/Container'
import Footer from 'app/components/Footer'
import Header from 'app/components/Header'
import Main from 'app/components/Main'
import Popups from 'app/components/Popups'
import { classNames } from 'app/functions'
import React, { FC } from 'react'

interface TridentHeaderProps {
  className?: string
  pattern?: BackgroundVariant
  maxWidth?: MaxWidth
  condensed?: boolean
}

export const TridentHeader: FC<TridentHeaderProps> = ({
  children,
  className,
  pattern,
  maxWidth = '7xl',
  condensed,
}) => {
  return (
    <header className="relative flex flex-col items-center justify-center w-full">
      <Background variant={pattern} />
      <Container
        maxWidth={maxWidth}
        className={classNames('flex flex-col gap-5 z-[1] p-6 lg:py-10', condensed && 'py-5', className)}
      >
        {children}
      </Container>
    </header>
  )
}

interface TridentBodyProps {
  className?: string
  maxWidth?: MaxWidth
}

export const TridentBody: FC<TridentBodyProps> = ({ children, className, maxWidth = '7xl' }) => {
  return (
    <Main>
      <Container
        maxWidth={maxWidth}
        className={classNames('flex flex-col gap-10 z-[1] p-6 lg:py-10 mx-auto', className)}
      >
        {children}
      </Container>
    </Main>
  )
}

const TridentLayout: FC = ({ children = [] }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col items-center flex-grow w-full">
        <div className="flex flex-col flex-grow w-full">{children}</div>
        <Popups />
      </div>
      <Footer />
    </div>
  )
}

export default TridentLayout
