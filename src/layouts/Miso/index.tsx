import Banner from '../../components/Banner'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Main from '../../components/Main'
import Popups from '../../components/Popups'

const Layout = ({ children }) => {
  return (
    <div className="z-0 flex flex-col items-center w-full h-screen overflow-x-hidden overflow-y-auto">
      {/* <Banner /> */}
      <Header />
      <main
        className="flex flex-col items-center justify-start flex-grow w-full h-full"
        style={{ height: 'max-content' }}
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
