import React, { useState } from 'react'
import { ChainId } from '@sushiswap/sdk'
import { Link, RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { transparentize } from 'polished'
import { useActiveWeb3React } from '../../hooks'

// Components
import { BaseCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import QuestionHelper from '../../components/QuestionHelper'

import USDCIcon from '../../assets/kashi/tokens/usdc-square.png'
import DaiIcon from '../../assets/kashi/tokens/dai-square.png'
import ChainlinkIcon from '../../assets/kashi/oracles/chainlink.png'

import Supply from './Supply'
import Borrow from './Borrow'
import Leverage from './Leverage'

import Tabs from './Tabs'

import useKashiPairHelper from '../../sushi-hooks/queries/useKashiPairHelper'
import getTokenIcon from '../../sushi-hooks/queries/getTokenIcons'
import { formattedNum } from '../../utils'

import { BarChart, User, Search, ArrowLeft } from 'react-feather'

//import Charts from './Charts'

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`

const PageWrapper = styled(AutoColumn)`
  max-width: 500px; /* 480px */
  width: 100%;
`

const StyledBaseCard = styled(BaseCard)`
  border: none
  background: ${({ theme }) => transparentize(0.6, theme.bg1)};
  position: relative;
  overflow: hidden;
`

const tabs = [
  {
    title: 'Supply',
    id: 'supply'
  },
  {
    title: 'Borrow',
    id: 'borrow'
  },
  {
    title: 'Leverage',
    id: 'leverage'
  }
]

interface TokenProps {
  address: string
  symbol: string
}
interface TabsBodyProps {
  section: string
  collateral: TokenProps
  asset: TokenProps
  pairAddress: string
}

// eslint-disable-next-line react/prop-types
function TabsBody({ section, collateral, asset, pairAddress }: TabsBodyProps) {
  switch (section) {
    case 'supply':
      return <Supply tokenAddress={collateral.address} tokenSymbol={collateral.symbol} pairAddress={pairAddress} />
    case 'borrow':
      return <Borrow tokenAddress={asset.address} tokenSymbol={asset.symbol} pairAddress={pairAddress} />
    case 'leverage':
      return <Leverage />
    default:
      return null
  }
}
export default function KashiPair({
  match: {
    params: { pairAddress }
  }
}: RouteComponentProps<{ pairAddress: string }>) {
  const [section, setSection] = useState('supply')
  const { chainId } = useActiveWeb3React()

  const summary = useKashiPairHelper(pairAddress)
  const pair = summary?.pair[0]

  const collateral = { address: pair?.collateral.address, symbol: pair?.collateral.symbol }
  const asset = { address: pair?.asset.address, symbol: pair?.asset.symbol }

  return (
    <>
      <PageWrapper>
        <div className="flex-col space-y-8">
          <div>
            <div className="block flex justify-between items-center">
              {/* <StyledArrowLeft /> */}
              <div></div>
              <nav className="-mb-px flex space-x-4">
                <Link to="/bento/kashi/pairs" className="border-transparent py-2 px-1 border-b-2">
                  <div className="flex items-center text-gray-500 hover:text-gray-400 font-semibold">
                    <div className="whitespace-nowrap text-base mr-2">Markets</div>
                    <BarChart size={16} />
                  </div>
                </Link>
                <Link to="/bento/kashi/positions" className="border-transparent py-2 px-1 border-b-2">
                  <div className="flex items-center text-gray-500 hover:text-gray-400 font-semibold">
                    <div className="whitespace-nowrap text-base mr-2">Positions</div>
                    <User size={16} />
                  </div>
                </Link>
                <Link to="/bento/balances" className="border-transparent py-2 px-1 border-b-2">
                  <div className="flex items-center text-gray-500 hover:text-gray-400 font-semibold">
                    <div className="whitespace-nowrap text-base mr-2">My Bento</div>
                  </div>
                </Link>
              </nav>
            </div>
            <StyledBaseCard padding={'0px'}>
              {/* Header */}
              <div
                className="py-4 px-6"
                style={{
                  //borderRight: '2px solid rgba(0, 0, 0, 0.1)',
                  borderBottom: '2px solid rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="flex space-x-2 mr-4">
                    <a
                      href={
                        `${
                          chainId === ChainId.MAINNET
                            ? 'https://www.etherscan.io/address/'
                            : chainId === ChainId.ROPSTEN
                            ? 'https://ropsten.etherscan.io/address/'
                            : null
                        }` + pair?.collateral.address
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={pair && getTokenIcon(pair?.collateral.address)}
                        className="w-10 y-10 sm:w-12 sm:y-12 rounded-lg"
                      />
                    </a>
                    <a
                      href={
                        `${
                          chainId === ChainId.MAINNET
                            ? 'https://www.etherscan.io/address/'
                            : chainId === ChainId.ROPSTEN
                            ? 'https://ropsten.etherscan.io/address/'
                            : null
                        }` + pair?.asset.address
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={pair && getTokenIcon(pair?.asset.address)}
                        className="w-10 y-10 sm:w-12 sm:y-12 rounded-lg"
                      />
                    </a>
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex justify-between items-center">
                    <div>
                      <div className="text-base sm:text-2xl font-bold">
                        {pair && `${pair.collateral.symbol + '/' + pair.asset.symbol}`}
                      </div>
                      <div className="flex">
                        <div className="text-xs sm:text-base font-semibold text-gray-400 mr-2">Net APY:</div>
                        <div className="text-xs sm:text-base font-semibold" style={{ color: '#de5597' }}>
                          -3.25%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <div>
                      <div className="text-base sm:text-lg font-bold">{pair && 'Chainlink'}</div>
                      <div className="text-xs sm:text-base font-semibold text-gray-400">Oracle ↗</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* User Balances */}
              <div
                className="pt-2 pb-4 px-6"
                style={{
                  //borderRight: '2px solid rgba(0, 0, 0, 0.1)',
                  borderBottom: '2px solid rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="text-sm sm:text-base text-gray-500 font-semibold pb-2">Your balances</div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="flex-col">
                    <div className="flex items-center">
                      <div className="text-gray-400 text-xs sm:text-base font-semibold">Supplied: </div>
                      <QuestionHelper text="The amount of collateral you have supplied for this Kashi Pair. The dollar value is estimated using the Sushiswap Oracle." />
                    </div>
                    <div className="flex items-baseline">
                      <div className="text-sm sm:text-lg font-bold mr-2">
                        {pair && `≈ ${formattedNum(pair.user.collateral.usdString, true)}`}
                      </div>
                    </div>
                    <div className="text-xs sm:text-base font-semibold" style={{ color: '#6ca8ff' }}>
                      {pair && `${formattedNum(pair.user.collateral.string) + ' ' + pair.collateral.symbol}`}
                    </div>
                  </div>
                  <div className="flex-col">
                    <div className="flex items-center">
                      <div className="text-gray-400 text-xs sm:text-base font-semibold">Borrowed: </div>
                      <QuestionHelper text="The amount of assets you have borrowed from this Kashi Pair. The dollar value is estimated using the Sushiswap Oracle." />
                    </div>
                    <div className="flex items-baseline">
                      <div className="text-sm sm:text-lg font-bold mr-2">
                        {pair && `≈ ${formattedNum(pair.user.asset.usdString, true)}`}
                      </div>
                    </div>
                    <div className="text-xs sm:text-base font-semibold" style={{ color: '#de5597' }}>
                      {pair && `${formattedNum(pair.user.asset.string) + ' ' + pair.asset.symbol}`}
                    </div>
                  </div>
                  <div className="flex-col">
                    <div className="flex items-center">
                      <div className="text-gray-400 text-xs sm:text-base font-semibold">Net Worth: </div>
                      <QuestionHelper text="The amount of assets you have borrowed from this Kashi Pair. The dollar value is estimated using the Sushiswap Oracle." />
                    </div>
                    <div className="flex items-baseline">
                      <div className="text-sm sm:text-lg font-bold mr-2">
                        {pair && `≈ ${formattedNum(pair.user?.netWorth?.usdString, true)}`}
                      </div>
                    </div>
                    <div className="text-xs sm:text-base font-semibold text-gray-800">{pair && '-'}</div>
                  </div>
                </div>
              </div>
              {/* Tabs */}
              <div
                className="py-4 px-6"
                style={{
                  //borderRight: '2px solid rgba(0, 0, 0, 0.1)',
                  borderBottom: '2px solid rgba(0, 0, 0, 0.1)'
                }}
              >
                <Tabs tabs={tabs} selected={section} setSelected={setSection} />
              </div>
              {/* Tabs Body */}
              <div
                className="py-4 px-6"
                style={{
                  //borderRight: '2px solid rgba(0, 0, 0, 0.1)',
                  borderBottom: '2px solid rgba(0, 0, 0, 0.1)'
                }}
              >
                {pair && <TabsBody section={section} collateral={collateral} asset={asset} pairAddress={pairAddress} />}
              </div>
              <div className="py-4 px-6"></div>
            </StyledBaseCard>
          </div>
        </div>
      </PageWrapper>
    </>
  )
}
