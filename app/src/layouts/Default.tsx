import Banner from '../components/Banner'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Main from '../components/Main'

const Default = ({ children }) => {
    return (
        <div className="flex flex-col items-start overflow-x-hidden overflow-y-auto h-screen w-screen z-0">
            {/* <Banner /> */}
            <Header />
            <Main>{children}</Main>
            <Footer />
        </div>
    )
}

export default Default
