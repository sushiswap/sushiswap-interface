import Container from 'app/components/Container'
import Header from 'components/Header'
import Popups from 'components/Popups'
import React, { FC } from 'react'

const MisoLayout: FC = ({ children }) => {
  return (
    <>
      <Header />
      <Container maxWidth="7xl" className="mx-auto">
        <div className="flex flex-col items-center w-full h-screen">
          <div className="bg-dark-1000 w-full flex-grow flex flex-col">{children}</div>
          <Popups />
        </div>
      </Container>
    </>
  )
}

export default MisoLayout
