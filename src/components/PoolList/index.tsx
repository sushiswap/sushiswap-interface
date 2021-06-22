import { ChevronDown, ChevronUp } from 'react-feather'
import { formatNumber, formatPercent } from '../../functions/format'
import { useFuse, useSortableData } from '../../hooks'

import Card from '../../components/Card'
import CardHeader from '../../components/CardHeader'
import Dots from '../../components/Dots'
import DoubleLogo from '../../components/DoubleLogo'
import Head from 'next/head'
import Paper from '../../components/Paper'
import React from 'react'
import Router from 'next/router'
import Search from '../../components/Search'
import { useCurrency } from '../../hooks/Tokens'
import useFarms from '../../hooks/useZapperFarms'

const TokenBalance = ({ farm }: any) => {
  const currency0 = useCurrency(farm.liquidityPair.token0.id)
  const currency1 = useCurrency(farm.liquidityPair.token1.id)
  return (
    <>
      {farm.type === 'SLP' && (
        <Paper className="bg-dark-800">
          <div
            className="grid grid-cols-3 px-4 py-4 text-sm rounded cursor-pointer select-none"
            onClick={() => Router.push(`zap?poolAddress=${farm.pairAddress}&currencyId=ETH`)}
          >
            <div className="flex items-center">
              <div className="mr-4">
                <DoubleLogo currency0={currency0} currency1={currency1} size={32} margin={true} />
              </div>
              <div className="hidden sm:block">
                {farm && farm.liquidityPair.token0.symbol + '-' + farm.liquidityPair.token1.symbol}
              </div>
            </div>
            <div className="flex items-center justify-end">
              <div>
                <div className="text-right">{formatNumber(farm.tvl, true)} </div>
                <div className="text-right text-secondary">{formatNumber(farm.slpBalance / 1e18, false)} SLP</div>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <div className="text-xl font-semibold text-right">{formatPercent(farm.roiPerYear * 100)} </div>
            </div>
          </div>
        </Paper>
      )}
    </>
  )
}

const PoolList = () => {
  const query = useFarms()

  const farms = query?.farms
  const userFarms = query?.userFarms

  // Search Setup
  const options = { keys: ['symbol', 'name', 'pairAddress'], threshold: 0.4 }
  const { result, search, term } = useFuse({
    data: farms && farms.length > 0 ? farms : [],
    options,
  })

  // Sorting Setup
  const { items, requestSort, sortConfig } = useSortableData(result, {
    key: 'tvl',
    direction: 'descending',
  })

  return (
    <>
      <Head>
        <title>Zap | Sushi</title>
        <meta name="description" content="Farm SUSHI by staking LP (Liquidity Provider) tokens" />
      </Head>
      <div className="container max-w-2xl px-0 mx-auto sm:px-4">
        <Card
          className="h-full rounded bg-dark-900"
          header={
            <CardHeader className="flex items-center justify-between bg-dark-800">
              <div className="flex flex-col items-center justify-between w-full">
                <div className="items-center hidden md:flex">
                  {/* <BackButton defaultRoute="/pool" /> */}
                  <div className="mb-2 mr-2 text-lg whitespace-nowrap">Select a Pool to Zap Into</div>
                </div>
                <Search search={search} term={term} />
              </div>
            </CardHeader>
          }
        >
          {/* All Farms */}
          <div className="grid grid-cols-3 px-4 pb-4 text-sm text-secondary">
            <div
              className="flex items-center cursor-pointer hover:text-secondary"
              onClick={() => requestSort('symbol')}
            >
              <div>Pool</div>
              {sortConfig &&
                sortConfig.key === 'symbol' &&
                ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                  (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
            </div>
            <div className="cursor-pointer hover:text-secondary" onClick={() => requestSort('tvl')}>
              <div className="flex items-center justify-end">
                <div>TVL</div>
                {sortConfig &&
                  sortConfig.key === 'tvl' &&
                  ((sortConfig.direction === 'ascending' && <ChevronUp size={12} />) ||
                    (sortConfig.direction === 'descending' && <ChevronDown size={12} />))}
              </div>
            </div>
            <div className="cursor-pointer hover:text-secondary" onClick={() => requestSort('roiPerYear')}>
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
            {items && items.length > 0 ? (
              items.map((farm: any, i: number) => {
                return <TokenBalance key={farm.address + '_' + i} farm={farm} />
              })
            ) : (
              <>
                {term ? (
                  <div className="w-full py-6 text-center">No Results.</div>
                ) : (
                  <div className="w-full py-6 text-center">
                    <Dots>Fetching Pools</Dots>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </>
  )
}

export default PoolList
