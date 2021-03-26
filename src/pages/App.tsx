import React, { Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ChainId } from '@sushiswap/sdk'
import { useActiveWeb3React } from '../hooks/index'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'

import AddressClaimModal from '../components/claim/AddressClaimModal'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import { ApplicationModal } from '../state/application/actions'
import { useModalOpen, useToggleModal } from '../state/application/hooks'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity
} from './AddLiquidity/redirects'
import RemoveV1Exchange from './MigrateV1/RemoveV1Exchange'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import Swap from './Swap'
import { RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'

import SushiBar from './SushiBar'

import Test from './Test'
//Feat Bento
import Bento from './BentoBox'
import BentoBalances from './BentoBoxBalances'

// Feat Kashi
import Connect from '../kashi/pages/Connect'
import WalletRoute from '../kashi/WalletRoute'
import PublicRoute from '../kashi/PublicRoute'
import KashiPairSupply from '../kashi/pages/PairSupply'
import KashiPairBorrow from '../kashi/pages/PairBorrow'
import KashiPositionsSupply from '../kashi/pages/PositionsSupply'
import KashiPositionsBorrow from '../kashi/pages/PositionsBorrow'
import SupplyMarkets from '../kashi/pages/SupplyMarkets'
import BorrowMarkets from '../kashi/pages/BorrowMarkets'

// Additional Tools
import Tools from './Tools'

import Saave from './Saave'

import { KashiProvider } from 'kashi/context'

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
  padding-top: 30px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-top: 10px;
    /* padding: 0 16px;*/
  `};
`

const Marginer = styled.div`
  margin-top: 5rem;
`

export default function App() {
  const { chainId } = useActiveWeb3React()
  return (
    <Suspense fallback={null}>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      <AppWrapper>
        <URLWarning />
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          <Popups />
          <Polling />
          <Web3ReactManager>
            <KashiProvider>
              <Switch>
                {process.env.NODE_ENV === 'development' && <Route exact strict path="/test" component={Test} />}
                <PublicRoute exact path="/connect" component={Connect} />
                {/* BentoApps */}
                <Route exact strict path="/bento" component={Bento} />
                <Route exact strict path="/bento/kashi" render={() => <Redirect to="/bento/kashi/supply" />} />
                <WalletRoute exact strict path="/bento/kashi/supply" component={SupplyMarkets} />
                <WalletRoute exact strict path="/bento/kashi/borrow" component={BorrowMarkets} />
                <Route
                  exact
                  strict
                  path="/bento/kashi/positions"
                  render={() => <Redirect to="/bento/kashi/positions/supply" />}
                />
                <WalletRoute exact strict path="/bento/kashi/positions/supply" component={KashiPositionsSupply} />
                <WalletRoute exact strict path="/bento/kashi/positions/borrow" component={KashiPositionsBorrow} />
                <WalletRoute exact strict path="/bento/kashi/pair/:pairAddress/supply" component={KashiPairSupply} />
                <WalletRoute exact strict path="/bento/kashi/pair/:pairAddress/borrow" component={KashiPairBorrow} />
                <WalletRoute exact strict path="/bento/balances" component={BentoBalances} />
                {/* Tools */}
                <Route exact strict path="/tools" component={Tools} />
                <Route exact strict path="/saave" component={Saave} />
                {/* Pages */}
                {chainId === ChainId.MAINNET && <Route exact strict path="/stake" component={SushiBar} />}
                <Route exact path="/sushibar" render={() => <Redirect to="/stake" />} />
                {/* Pages */}
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
                <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                <Route exact strict path="/remove/v1/:address" component={RemoveV1Exchange} />
                <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
                <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
                <Route component={RedirectPathToSwapOnly} />
              </Switch>
            </KashiProvider>
          </Web3ReactManager>
          <Marginer />
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  )
}
