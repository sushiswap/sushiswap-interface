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
//import Earn from './Earn'
//import Manage from './Earn/Manage'
//import MigrateV1 from './MigrateV1'
//import MigrateV1Exchange from './MigrateV1/MigrateV1Exchange'
import MigrateV2 from './MigrateV2'
import RemoveV1Exchange from './MigrateV1/RemoveV1Exchange'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import Swap from './Swap'
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
//import Vote from './Vote'
//import VotePage from './Vote/VotePage'

import SushiBar from './SushiBar'
import Yield from './Yield'

// Additional Tools
import Tools from './Tools'
import Saave from './Saave'
import Vesting from './Vesting'

import ComingSoonModal from '../components/ComingSoonModal'

import { hot } from 'react-hot-loader'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
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
            <Switch>
              {/* Tools */}
              <Route exact strict path="/tools" component={Tools} />
              <Route exact strict path="/saave" component={Saave} />
              <Route exact strict path="/vesting" component={Vesting} />
              {chainId === ChainId.MAINNET && <Route exact strict path="/migrate/v2" component={MigrateV2} />}
              {/* Pages */}
              {chainId === ChainId.MAINNET && <Route exact strict path="/stake" component={SushiBar} />}
              <Route exact path="/sushibar" render={() => <Redirect to="/stake" />} />
              {/* Pages */}
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
              <Route exact strict path="/find" component={PoolFinder} />
              <Route exact strict path="/pool" component={Pool} />
              <Route exact strict path="/yield" component={Yield} />
              {/* <Route exact strict path="/sushi" component={Earn} /> */}
              {/* <Route exact strict path="/vote" component={Vote} /> */}
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
              {/* <Route exact strict path="/migrate/v1" component={MigrateV1} /> */}
              {/* <Route exact strict path="/migrate/v1/:address" component={MigrateV1Exchange} /> */}
              {/* <Route exact strict path="/uni/:currencyIdA/:currencyIdB" component={Manage} /> */}
              {/* <Route exact strict path="/vote/:id" component={VotePage} /> */}
              <Route component={RedirectPathToSwapOnly} />
            </Switch>
          </Web3ReactManager>
          <Marginer />
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  )
}

export default hot(module)(App)
