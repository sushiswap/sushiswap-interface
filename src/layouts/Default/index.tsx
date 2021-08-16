import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Main from '../../components/Main'

const Layout = ({ children }) => {
  return (
    <div className="z-0 flex flex-col items-center w-full h-screen pb-16 lg:pb-0">
      {/* <Banner /> */}
      <Header />
      <Main>{children}</Main>
      <Footer />
    </div>
  )
}

export default Layout
