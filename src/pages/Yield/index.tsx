import React, { useState } from 'react'
import styled from 'styled-components'
import { RowBetween } from '../../components/Row'

import { useActiveWeb3React } from 'hooks'
import { formatFromBalance, formattedNum, formattedPercent } from '../../utils'
import { Card, CardHeader, Paper, Search, BackButton, DoubleLogo } from './components'
// import { ReactComponent as BentoBoxLogo } from 'assets/kashi/bento-symbol.svg'
//import BentoBoxImage from 'assets/kashi/bento-illustration.png'
import useFuse from 'sushi-hooks/useFuse'
import useSortableData from 'sushi-hooks/useSortableData'
import useFarms from 'sushi-hooks/useFarms'
import { ChevronUp, ChevronDown } from 'react-feather'

import InputGroup from './InputGroup'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export default function BentoBalances(): JSX.Element {
  const farms = useFarms()

  // Search Setup
  const options = { keys: ['symbol', 'name', 'pairAddress'], threshold: 0.4 }
  const { result, search, term } = useFuse({
    data: farms && farms.length > 0 ? farms : [],
    options
  })
  const flattenSearchResults = result.map((a: { item: any }) => (a.item ? a.item : a))
  // Sorting Setup
  const { items, requestSort, sortConfig } = useSortableData(flattenSearchResults)

  return (
    <div className="container max-w-2xl mx-auto px-0 sm:px-4">
      <Card
        className="h-full bg-dark-900"
        header={
          <CardHeader className="flex justify-between items-center bg-dark-800">
            <div className="flex w-full justify-between">
              <div className="hidden md:flex items-center">
                {/* <BackButton defaultRoute="/pool" /> */}
                <div className="text-lg mr-2 whitespace-nowrap">Yield Instruments</div>
              </div>
              <Search search={search} term={term} />
            </div>
          </CardHeader>
        }
      >
        <div className="grid grid-cols-3 pb-4 sm:px-4 text-sm  text-secondary">
          <div className="flex items-center cursor-pointer hover:text-secondary" onClick={() => requestSort('symbol')}>
            <div>Instruments</div>
            {sortConfig &&
              sortConfig.key === 'symbol' &&
              ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
          </div>
          <div className="hidden md:block hover:text-secondary cursor-pointer" onClick={() => requestSort('tvl')}>
            <div className="flex items-center justify-end">
              <div>TVL</div>
              {sortConfig &&
                sortConfig.key === 'tvl' &&
                ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                  (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
            </div>
          </div>
          <div className="hover:text-secondary cursor-pointer" onClick={() => requestSort('roiPerYear')}>
            <div className="flex items-center justify-end">
              <div>APR</div>
              {sortConfig &&
                sortConfig.key === 'roiPerYear' &&
                ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                  (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
            </div>
          </div>
        </div>
        <div className="flex-col space-y-2">
          {items &&
            items.length > 0 &&
            items.map((farm: any, i: number) => {
              return <TokenBalance key={farm.address + '_' + i} farm={farm} />
            })}
        </div>
      </Card>
    </div>
  )
}

const TokenBalance = ({ farm }: any) => {
  const [expand, setExpand] = useState<boolean>(false)
  //const walletBalance = formatFromBalance(balance?.balance, balance?.amount?.decimals)
  //const bentoBalance = formatFromBalance(balance?.bentoBalance, balance?.amount?.decimals)
  //const { chainId } = useActiveWeb3React()

  return (
    <Paper className="bg-dark-800">
      <div
        className="grid grid-cols-3 py-4 px-4 cursor-pointer select-none rounded text-sm"
        onClick={() => setExpand(!expand)}
      >
        <div className="flex items-center">
          <div className="mr-4">
            <DoubleLogo a0={farm.liquidityPair.token0.id} a1={farm.liquidityPair.token1.id} size={26} margin={true} />
          </div>
          <div className="hidden sm:block">
            {farm && farm.liquidityPair.token0.symbol + '-' + farm.liquidityPair.token1.symbol}
          </div>
        </div>
        <div className="flex justify-end items-center">
          <div>
            <div className="text-right">{formattedNum(farm.tvl, true)} </div>
            <div className="text-secondary text-right">{formattedNum(farm.slpBalance / 1e18, false)} SLP</div>
          </div>
        </div>
        <div className="flex justify-end items-center">
          <div className="text-right font-semibold text-xl">{formattedPercent(farm.roiPerYear * 100)} </div>
        </div>
      </div>
      {expand && <InputGroup tokenAddress={farm.pairAddress} tokenSymbol={farm.symbol} />}
    </Paper>
  )
}
