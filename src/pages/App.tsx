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
//import Earn from './Earn'
//import Manage from './Earn/Manage'
//import MigrateV1 from './MigrateV1'
//import MigrateV1Exchange from './MigrateV1/MigrateV1Exchange'
import RemoveV1Exchange from './MigrateV1/RemoveV1Exchange'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import Swap from './Swap'
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
//import Vote from './Vote'
//import VotePage from './Vote/VotePage'

import TestBed from '../sushi-hooks/TestBed'

import SushiBar from './SushiBar'
import Bento from './Bento'
import BentoBalances from './BentoBalances'
import KashiPairs from './KashiPairs'
import KashiPair from './KashiPair'
import KashiPositions from './KashiPositions'

// Additional Tools
import Tools from './Tools'
import Saave from './Saave'

import ComingSoonModal from '../components/ComingSoonModal'

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

function TopLevelModals() {
  const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
  const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
  return <AddressClaimModal isOpen={open} onDismiss={toggle} />
}

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
          <TopLevelModals />
          <ComingSoonModal />
          <Web3ReactManager>
            <Switch>
              {process.env.NODE_ENV === 'development' && <Route exact strict path="/testbed" component={TestBed} />}
              {/* BentoApps */}
              {chainId === ChainId.ROPSTEN && (
                <>
                  <Route exact strict path="/bento" component={Bento} />
                  <Route exact strict path="/bento/kashi/pairs" component={KashiPairs} />
                  <Route exact strict path="/bento/kashi/positions" component={KashiPositions} />
                  <Route exact strict path="/bento/kashi/pair/:pairAddress" component={KashiPair} />
                  <Route exact strict path="/bento/balances" component={BentoBalances} />
                </>
              )}
              {/* Tools */}
              <Route exact strict path="/tools" component={Tools} />
              <Route exact strict path="/saave" component={Saave} />
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
