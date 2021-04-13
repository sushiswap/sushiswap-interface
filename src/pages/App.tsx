import { ChainId } from '@sushiswap/sdk'
import React, { Suspense, useEffect, useRef } from 'react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import PublicRoute from '../hocs/PublicRoute'
// Feat Kashi
import WalletRoute from '../hocs/WalletRoute'
import { useActiveWeb3React } from '../hooks/index'
import Connect from '../kashi/pages/Connect'
import BorrowMarkets from '../kashi/pages/Markets/Borrow'
import CreateMarkets from '../kashi/pages/Markets/Create'
import LendMarkets from '../kashi/pages/Markets/Lending'
import BorrowPair from '../kashi/pages/Pair/Borrow'
import LendPair from '../kashi/pages/Pair/Lend'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import {
    RedirectDuplicateTokenIds,
    RedirectOldAddLiquidityPathStructure,
    RedirectToAddLiquidity
} from './AddLiquidity/redirects'
//Feat Bento
import Bento from './BentoBox'
import BentoBalances from './BentoBox/Balances'
import RemoveV1Exchange from './MigrateV1/RemoveV1Exchange'
//import Earn from './Earn'
//import Manage from './Earn/Manage'
//import MigrateV1 from './MigrateV1'
//import MigrateV1Exchange from './MigrateV1/MigrateV1Exchange'
import MigrateV2 from './MigrateV2'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import Saave from './Saave'
import SushiBar from './SushiBar'
import Swap from './Swap'
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
// Additional Tools
import Tools from './Tools'
import Vesting from './Vesting'
import Yield from './Yield'
import { Shell } from '../components/App'

const AppWrapper = styled.div`
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    overflow-x: hidden;
    height: 100vh;
`

const HeaderWrapper = styled.div`
    ${({ theme }) => theme.flexRowNoWrap}
    width: 100%;
    justify-content: space-between;
`

const BodyWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: 50px;
    align-items: center;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 10;

    ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 1rem;
  `};

    z-index: 1;
`

const Marginer = styled.div`
    margin-top: 5rem;
`

function App() {
    const { chainId } = useActiveWeb3React()
    const bodyRef = useRef<any>(null)

    const { pathname } = useLocation()

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTo(0, 0)
        }
    }, [pathname])

    return (
        <Suspense fallback={null}>
            <Route component={GoogleAnalyticsReporter} />
            <Route component={DarkModeQueryParamReader} />
            <div className="flex flex-col items-start overflow-x-hidden h-full">
                <URLWarning />
                <HeaderWrapper>
                    <Header />
                </HeaderWrapper>
                <BodyWrapper ref={bodyRef}>
                    <Popups />
                    <Polling />
                    <Web3ReactManager>
                        <Switch>
                            <PublicRoute exact path="/connect" component={Connect} />
                            {/* BentoApps */}
                            <Route exact strict path="/bento" component={Bento} />
                            <WalletRoute exact strict path="/bento/balances" component={BentoBalances} />

                            {/* Kashi */}
                            <Route
                                exact
                                strict
                                path="/bento/kashi"
                                render={() => <Redirect to="/bento/kashi/borrow" />}
                            />
                            <WalletRoute exact strict path="/bento/kashi/lend" component={LendMarkets} />
                            <WalletRoute exact strict path="/bento/kashi/borrow" component={BorrowMarkets} />
                            <WalletRoute exact strict path="/bento/kashi/create" component={CreateMarkets} />
                            <WalletRoute exact strict path="/bento/kashi/lend/:pairAddress" component={LendPair} />
                            <WalletRoute exact strict path="/bento/kashi/borrow/:pairAddress" component={BorrowPair} />

                            <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
                            <Route exact strict path="/yield" component={Yield} />
                            <Route exact strict path="/vesting" component={Vesting} />
                            {chainId === ChainId.MAINNET && (
                                <Route exact strict path="/migrate/v2" component={MigrateV2} />
                            )}

                            {/* Tools */}
                            <Route exact strict path="/tools" component={Tools} />
                            <Route exact strict path="/saave" component={Saave} />

                            {/* Pages */}
                            {chainId === ChainId.MAINNET && <Route exact strict path="/stake" component={SushiBar} />}
                            <Route exact path="/sushibar" render={() => <Redirect to="/stake" />} />
                            <Route exact strict path="/swap" component={Swap} />
                            <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
                            <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
                            <Route exact strict path="/find" component={PoolFinder} />
                            <Route exact strict path="/pool" component={Pool} />
                            <Route exact strict path="/create" component={RedirectToAddLiquidity} />
                            <Route exact path="/add" component={AddLiquidity} />
                            <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                            <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                            <Route exact path="/create" component={AddLiquidity} />
                            <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                            <Route
                                exact
                                path="/create/:currencyIdA/:currencyIdB"
                                component={RedirectDuplicateTokenIds}
                            />
                            <Route exact strict path="/remove/v1/:address" component={RemoveV1Exchange} />
                            <Route
                                exact
                                strict
                                path="/remove/:tokens"
                                component={RedirectOldRemoveLiquidityPathStructure}
                            />
                            <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />

                            {/* Redirects for app routes */}
                            <Route
                                exact
                                strict
                                path="/tokens/:address"
                                render={({
                                    match: {
                                        params: { address }
                                    }
                                }) => <Redirect to={`/swap/${address}`} />}
                            />
                            <Route
                                exact
                                strict
                                path="/pairs/:address"
                                render={({
                                    match: {
                                        params: { address }
                                    }
                                }) => <Redirect to={`/add/${address}`} />}
                            />

                            <Route component={RedirectPathToSwapOnly} />
                        </Switch>
                    </Web3ReactManager>
                    <Marginer />
                </BodyWrapper>
            </div>
        </Suspense>
    )
}

export default App
