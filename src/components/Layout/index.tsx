import Banner from '../Banner'
import Footer from '../Footer'
import Header from '../Header'
import Main from '../Main'

const Layout = ({ children }) => {
    return (
        <div className="z-0 flex flex-col items-center h-screen overflow-x-hidden overflow-y-auto">
            {/* <Banner /> */}
            <Header />
            <Main>{children}</Main>
            <Footer />
        </div>
    )
}

export default Layout
