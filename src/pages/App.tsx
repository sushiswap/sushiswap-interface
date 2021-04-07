import React, { Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ChainId } from '@sushiswap/sdk'
import { useActiveWeb3React } from '../hooks/index'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'

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

//Feat Bento
import Bento from './BentoBox'
import BentoBalances from './BentoBoxBalances'

// Feat Kashi
import WalletRoute from '../hocs/WalletRoute'
import PublicRoute from '../hocs/PublicRoute'
import Connect from '../kashi/pages/Connect'
import KashiCreate from '../kashi/pages/Create'

import LendPair from '../kashi/pages/Pair/Lend'
import LendMarkets from '../kashi/pages/Markets/Lending'

import BorrowPair from '../kashi/pages/Pair/Borrow'
import BorrowMarkets from '../kashi/pages/Markets/Borrow'

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

function App() {
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
                <PublicRoute exact path="/connect" component={Connect} />
                {/* BentoApps */}
                <Route exact strict path="/bento" component={Bento} />
                <WalletRoute exact strict path="/bento/balances" component={BentoBalances} />

                {/* Kashi */}
                <Route exact strict path="/bento/kashi" render={() => <Redirect to="/bento/kashi/borrow" />} />
                <WalletRoute exact strict path="/bento/kashi/lend" component={LendMarkets} />
                <WalletRoute exact strict path="/bento/kashi/borrow" component={BorrowMarkets} />
                <WalletRoute exact strict path="/bento/kashi/create" component={KashiCreate} />
                <WalletRoute exact strict path="/bento/kashi/lend/:pairAddress" component={LendPair} />
                <WalletRoute exact strict path="/bento/kashi/borrow/:pairAddress" component={BorrowPair} />

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

export default App
