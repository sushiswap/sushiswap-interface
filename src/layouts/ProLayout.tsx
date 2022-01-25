import Header from 'app/components/Header'
import { FC } from 'react'

const ProLayout: FC = ({ children }) => {
  return (
    <>
      <div className="grid w-screen h-screen">
        <Header />
        {children}
      </div>
    </>
  )
}

export default ProLayout
