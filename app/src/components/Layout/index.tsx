import Banner from '../Banner'
import Footer from '../Footer'
import Header from '../Header'
import Main from '../Main'

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col items-start overflow-x-hidden overflow-y-auto h-screen w-screen z-0">
            {/* <Banner /> */}
            <Header />
            <Main>{children}</Main>
            <Footer />
        </div>
    )
}

export default Layout
