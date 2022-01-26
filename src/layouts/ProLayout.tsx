import Header from 'app/components/Header'
import { FC } from 'react'

const ProLayout: FC = ({ children }) => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] w-screen h-screen">
      <div className="bg-dark-900">
        <Header fixed={false} containerized={false} className="bg-dark-900" />
      </div>
      <div className="flex overflow-hidden">{children}</div>
    </div>
  )
}

export default ProLayout
