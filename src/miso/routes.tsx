import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import AuctionDetail from './pages/Auction/Detail'
import NewToken from './pages/Factory/Token'
import WalletRoute from 'components/WalletRoute'
import { MisoProvider } from './context'

const Miso = () => {
    return (
        <MisoProvider>
            <>
                <WalletRoute exact path="/miso/auction/:auctionId" component={AuctionDetail} />
                <WalletRoute exact path="/miso/factory/new" component={NewToken} />
                {/* <Route render={() => <Redirect to="/miso/auction/0x5cFEb913fe8aE7e5E63E5930F044f36Ba4B882aB"/>}/> */}
            </>
        </MisoProvider>
    )
}

export default Miso
