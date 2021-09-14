import Banner from '../../components/Banner'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Main from '../../components/Main'
import Popups from '../../components/Popups'

import { useActiveWeb3React } from '../../hooks'
// import { ChainId } from '@sushiswap/sdk'

const Layout = ({ children }) => {
  // const { chainId } = useActiveWeb3React()
  return (
    <div className="z-0 flex flex-col items-center w-full h-screen pb-16 lg:pb-0">
      {/* {chainId === ChainId.MAINNET ? <Banner /> : null} */}
      <Header />
      <Main>{children}</Main>
      <Popups />
      <Footer />
    </div>
  )
}

export default Layout
