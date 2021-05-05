import { ChainId } from '@sushiswap/sdk'
import React from 'react'
import { Redirect, Route, RouteComponentProps, useLocation, Switch } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import Connect from './kashi/pages/Connect'
import BorrowMarkets from './kashi/pages/Markets/Borrow'
import CreateMarkets from './kashi/pages/Markets/Create'
import LendMarkets from './kashi/pages/Markets/Lending'
import BorrowPair from './kashi/pages/Pair/Borrow'
import LendPair from './kashi/pages/Pair/Lend'
import AddLiquidity from './pages/AddLiquidity'
import {
    RedirectDuplicateTokenIds,
    RedirectOldAddLiquidityPathStructure,
    RedirectToAddLiquidity
} from './pages/AddLiquidity/redirects'
import Bento from './pages/BentoBox'
import BentoBalances from './pages/BentoBox/Balances'
import Migrate from './pages/Migrate'
import Pool from './pages/Pool'
import PoolFinder from './pages/PoolFinder'
import RemoveLiquidity from './pages/RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './pages/RemoveLiquidity/redirects'
import Saave from './pages/Saave'
import SushiBar from './pages/SushiBar'
import Trade from './pages/Trade'
import Swap from './pages/Swap'
import {
    RedirectHashRoutes,
    OpenClaimAddressModalAndRedirectToSwap,
    RedirectPathToSwapOnly,
    RedirectToSwap
} from './pages/Swap/redirects'
import Tools from './pages/Tools'
import Vesting from './pages/Vesting'
import MasterChefV1 from './pages/Yield/masterchefv1'
import MiniChefV2 from './pages/Yield/minichefv2'
import Positions from './pages/Positions'
import Transactions from './pages/Transactions'

function Routes(): JSX.Element {
    const { chainId } = useActiveWeb3React()
    return (
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

            {chainId === ChainId.MAINNET && (
                <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
            )}
            {chainId === ChainId.MAINNET && <Route exact strict path="/yield" component={MasterChefV1} />}
            {chainId === ChainId.MATIC && <Route exact strict path="/yield" component={MiniChefV2} />}
            {chainId === ChainId.MAINNET && <Route exact strict path="/vesting" component={Vesting} />}

            {/* Migrate */}
            {(chainId === ChainId.MAINNET || chainId === ChainId.BSC || chainId === ChainId.MATIC) && (
                <Route exact strict path="/migrate" component={Migrate} />
            )}

            {/* SushiBar Staking */}
            {chainId === ChainId.MAINNET && <Route exact strict path="/sushibar" component={SushiBar} />}
            {chainId === ChainId.MAINNET && <Route exact strict path="/stake" component={SushiBar} />}
            {/* Tools */}
            {chainId === ChainId.MAINNET && <Route exact strict path="/tools" component={Tools} />}
            {chainId === ChainId.MAINNET && <Route exact strict path="/saave" component={Saave} />}

            {/* Pages */}
            <Route exact strict path="/tradingview" component={Trade} />
            <Route exact strict path="/trade" component={Swap} />
            <Route exact strict path="/swap" component={Swap} />
            <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
            <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
            <Route exact strict path="/find" component={PoolFinder} />
            <Route exact strict path="/pool" component={Positions} />
            <Route exact strict path="/transactions" component={Transactions} />
            <Route exact strict path="/create" component={RedirectToAddLiquidity} />
            <Route exact path="/add" component={AddLiquidity} />
            <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <Route exact path="/create" component={AddLiquidity} />
            <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
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
    )
}

export default Routes

// A wrapper for <Route> that redirects to the Connect Wallet
// screen if you're not yet authenticated.
export const PublicRoute = ({ component: Component, children, ...rest }: any) => {
    const { account } = useActiveWeb3React()
    const location = useLocation<any>()
    return (
        <>
            <Route
                {...rest}
                render={(props: RouteComponentProps) =>
                    account ? (
                        <Redirect
                            to={{
                                pathname: location.state ? location.state.from.pathname : '/'
                            }}
                        />
                    ) : Component ? (
                        <Component {...props} />
                    ) : (
                        children
                    )
                }
            />
        </>
    )
}

// A wrapper for <Route> that redirects to the Connect Wallet
// screen if you're not yet authenticated.
export const WalletRoute = ({ component: Component, children, ...rest }: any) => {
    const { account } = useActiveWeb3React()
    return (
        <>
            <Route
                {...rest}
                render={({ location, props, match }: any) => {
                    return account ? (
                        Component ? (
                            <Component {...props} {...rest} match={match} />
                        ) : (
                            children
                        )
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/connect',
                                state: { from: location }
                            }}
                        />
                    )
                }}
            />
        </>
    )
}
