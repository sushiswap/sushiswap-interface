import Container, { MaxWidth } from 'app/components/Container'
import Main from 'app/components/Main'
import { classNames } from 'app/functions'
import Header from 'components/Header'
import Popups from 'components/Popups'
import React, { FC } from 'react'

interface MisoHeaderProps extends React.HTMLProps<HTMLHeadElement> {
  className?: string
  pattern?: string
  maxWidth?: MaxWidth
  condensed?: boolean
}

export const MisoHeader: FC<MisoHeaderProps> = ({ children, className, maxWidth = '7xl', condensed, ...props }) => {
  return (
    <header {...props} className={classNames('relative w-full bg-opacity-80 flex flex-col items-center', className)}>
      <Container
        maxWidth={maxWidth}
        className={classNames('flex flex-col gap-5 z-[1] py-10 px-5 lg:px-10', condensed && 'py-5')}
      >
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
      <Container maxWidth={maxWidth} className={classNames('flex flex-col gap-10 py-10 px-5 lg:p-10 z-[1]', className)}>
        {children}
      </Container>
    </Main>
  )
}

const MisoLayout: FC = ({ children }) => {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center w-full h-screen">
        <div className="bg-dark-1000 w-full flex-grow flex flex-col">{children}</div>
        <Popups />
      </div>
    </>
  )
}

export default MisoLayout
