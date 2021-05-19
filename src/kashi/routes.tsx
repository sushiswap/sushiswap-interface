import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import LendMarkets from './pages/Markets/Lending'
import BorrowMarkets from './pages/Markets/Borrow'
import CreateMarkets from './pages/Markets/Create'
import LendPair from './pages/Pair/Lend'
import BorrowPair from './pages/Pair/Borrow'
import WalletRoute from 'components/WalletRoute'
import { KashiProvider } from './context'

const Kashi = () => {
    return (
        <KashiProvider>
            <>
                <WalletRoute exact path="/bento/kashi/lend" component={LendMarkets} />
                <WalletRoute exact path="/bento/kashi/borrow" component={BorrowMarkets} />
                <WalletRoute exact path="/bento/kashi/create" component={CreateMarkets} />
                <WalletRoute exact path="/bento/kashi/lend/:pairAddress" component={LendPair} />
                <WalletRoute exact path="/bento/kashi/borrow/:pairAddress" component={BorrowPair} />
                <Redirect from="/bento/kashi" to="/bento/kashi/borrow" />
            </>
        </KashiProvider>
    )
}

export default Kashi
