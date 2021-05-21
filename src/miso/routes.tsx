import React from 'react'
import { Redirect } from 'react-router-dom'
import AuctionDetail from './pages/Auction/Detail'
import WalletRoute from 'components/WalletRoute'
import { MisoProvider } from './context'

const Kashi = () => {
    return (
        <MisoProvider>
            <>
                <WalletRoute exact path="/miso/auction/:auctionID" component={AuctionDetail} />
                <Redirect from="/miso" to="/miso/auction/0x5cFEb913fe8aE7e5E63E5930F044f36Ba4B882aB" />
            </>
        </MisoProvider>
    )
}

export default Kashi
