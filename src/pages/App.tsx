import { ChainId } from '@sushiswap/sdk'
import React, { Suspense, useEffect, useRef } from 'react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
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
import MigrateV2 from './MigrateV2'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import Saave from './Saave'
import SushiBar from './SushiBar'
import Swap from './Swap'
import {
    RedirectHashRoutes,
    OpenClaimAddressModalAndRedirectToSwap,
    RedirectPathToSwapOnly,
    RedirectToSwap
} from './Swap/redirects'
// Additional Tools
import Tools from './Tools'
import Vesting from './Vesting'
import Yield from './Yield'
import ReactGA from 'react-ga'

function App(): JSX.Element {
    const { chainId } = useActiveWeb3React()
    const bodyRef = useRef<any>(null)

    const { pathname, search } = useLocation()

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTo(0, 0)
        }
    }, [pathname])

    useEffect(() => {
        ReactGA.pageview(`${pathname}${search}`)
    }, [pathname, search])

    return (
        <Suspense fallback={null}>
            <Route component={DarkModeQueryParamReader} />
            <div className="flex flex-col items-start overflow-x-hidden h-screen">
                <div className="flex flex-row flex-nowrap justify-between w-screen">
                    <Header />
                </div>
                <div
                    ref={bodyRef}
                    className="flex flex-col flex-1 items-center justify-start w-screen h-full overflow-y-auto overflow-x-hidden z-0 pt-4 sm:pt-8 px-4 md:pt-10 pb-20"
                >
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
                                render={props => <Redirect to="/bento/kashi/borrow" {...props} />}
                            />
                            <WalletRoute exact strict path="/bento/kashi/lend" component={LendMarkets} />
                            <WalletRoute exact strict path="/bento/kashi/borrow" component={BorrowMarkets} />
                            <WalletRoute exact strict path="/bento/kashi/create" component={CreateMarkets} />
                            <WalletRoute exact strict path="/bento/kashi/lend/:pairAddress" component={LendPair} />
                            <WalletRoute exact strict path="/bento/kashi/borrow/:pairAddress" component={BorrowPair} />

                            <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
                            <Route exact strict path="/yield" component={Yield} />
                            <Route exact strict path="/vesting" component={Vesting} />
                            {(chainId === ChainId.MAINNET || chainId === ChainId.BSC) && (
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
                                path="/token/:address"
                                render={({
                                    match: {
                                        params: { address }
                                    }
                                }) => <Redirect to={`/swap/${address}`} />}
                            />
                            <Route
                                exact
                                strict
                                path="/pair/:address"
                                render={({
                                    match: {
                                        params: { address }
                                    }
                                }) => <Redirect to={`/pool`} />}
                            />

                            {/* Redirects for Legacy Hash Router paths */}
                            <Route exact strict path="/" component={RedirectHashRoutes} />
                            {/* Catch all */}
                            <Route component={RedirectPathToSwapOnly} />
                        </Switch>
                    </Web3ReactManager>
                </div>
            </div>
        </Suspense>
    )
}

export default App
