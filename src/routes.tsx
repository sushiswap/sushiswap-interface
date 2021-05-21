import { ChainId } from '@sushiswap/sdk'
import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import Connect from './kashi/pages/Connect'
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
import SushiBarTransactions from './pages/SushiBar/SushiBarTransactions'
import SushiBarTips from './pages/SushiBar/Tips'
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
import AddSingleSideLiquidity from './pages/AddSingleSideLiquidity'
import MasterChefV1 from './pages/Yield/masterchefv1'
import MiniChefV2 from './pages/Yield/minichefv2'
import Transactions from './pages/Transactions'
import PublicRoute from 'components/PublicRoute'
import WalletRoute from 'components/WalletRoute'
import Kashi from 'kashi/routes'
import Miso from 'miso/routes'

function Routes(): JSX.Element {
    const { chainId } = useActiveWeb3React()
    return (
        <Switch>
            <PublicRoute exact path="/connect" component={Connect} />
            {/* BentoApps */}
            <Route exact strict path="/bento" component={Bento} />
            <WalletRoute exact strict path="/bento/balances" component={BentoBalances} />

            {/* Kashi */}
            <Route strict path="/bento/kashi" component={Kashi} />

            {/* Miso */}
            <Route strict path="/miso" component={Miso} />

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
            {chainId === ChainId.MAINNET && (
                <Route exact strict path="/sushibar/transactions" component={SushiBarTransactions} />
            )}
            {chainId === ChainId.MAINNET && <Route exact strict path="/sushibar/tips" component={SushiBarTips} />}
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
            <Route exact strict path="/pool" component={Pool} />
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
            <Route exact strict path="/zap" component={AddSingleSideLiquidity} />
            <Route exact strict path="/zap/:poolAddress" component={AddSingleSideLiquidity} />
            <Route exact strict path="/zap/:poolAddress/:currencyId" component={AddSingleSideLiquidity} />

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
