import { useState, useMemo } from 'react'

import Head from 'next/head'
import Container from '../../../components/Container'
import Search from '../../../components/Search'
import { useFuse } from '../../../hooks'
import DashboardTabs from '../../../features/analytics/Dashboard/DashboardTabs'
import Menu from '../../../features/analytics/AnalyticsMenu'
import ChartCard from '../../../features/analytics/Dashboard/ChartCard'
import { useCustomDayBlock, useDayData, useExchange, useOneDayBlock, useOneWeekBlock } from '../../../services/graph'

export default function Dashboard(): JSX.Element {
  const term = ''
  const search = () => {}

  return (
    <>
      <Head>
        <title>SushiSwap Liquidity Pair (SLP) Analytics | Sushi</title>
        <meta name="description" content="SushiSwap Liquidity Pair (SLP) Analytics by Sushi" />
      </Head>

      <Container maxWidth="full" className="grid h-full grid-cols-5 mx-auto gap-9 grid-flow-col">
        <div className="sticky top-0 hidden lg:block md:col-span-1" style={{ maxHeight: '40rem' }}>
          <Menu />
        </div>
        <div className="col-span-5 space-y-6 lg:col-span-4">
          <div className="flex flex-row space-x-4">
            <ChartCard type="liquidity" />
            <ChartCard type="volume" />
          </div>
          <div className="flex flex-row items-center">
            <svg width="26" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.46492 19.7858H2.10026C1.41438 19.7858 0.85321 19.3047 0.85321 18.7168V8.02622C0.85321 7.43824 1.41438 6.95717 2.10026 6.95717H6.46492C7.15079 6.95717 7.71197 7.43824 7.71197 8.02622V18.7168C7.71197 19.3047 7.15079 19.7858 6.46492 19.7858ZM15.506 0.542847H11.1413C10.4555 0.542847 9.8943 1.02392 9.8943 1.6119V18.7168C9.8943 19.3047 10.4555 19.7858 11.1413 19.7858H15.506C16.1919 19.7858 16.7531 19.3047 16.7531 18.7168V1.6119C16.7531 1.02392 16.1919 0.542847 15.506 0.542847ZM24.5471 9.09528H20.1824C19.4966 9.09528 18.9354 9.57635 18.9354 10.1643V18.7168C18.9354 19.3047 19.4966 19.7858 20.1824 19.7858H24.5471C25.233 19.7858 25.7941 19.3047 25.7941 18.7168V10.1643C25.7941 9.57635 25.233 9.09528 24.5471 9.09528Z"
                fill="#E3E3E3"
              />
            </svg>
            <div className="ml-3 font-bold text-lg text-high-emphesis">Leaderboard</div>
          </div>
          <Search term={term} search={search} />
          <DashboardTabs />
          {/* <PairList pairs={pairsSearched} type={type} /> */}
        </div>
      </Container>
    </>
  )
}
