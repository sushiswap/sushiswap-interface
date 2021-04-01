import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { ChainId } from '@sushiswap/sdk'
import { RowBetween } from '../../components/Row'
import TokenDepositPanel from './TokenDepositPanel'
import TokenWithdrawPanel from './TokenWithdrawPanel'
import { useActiveWeb3React } from 'hooks'
import useBentoBalances from 'sushi-hooks/useBentoBalances'
import { formatFromBalance, formattedNum } from '../../utils'
import { Search, PlusSquare, MinusSquare, ChevronLeft } from 'react-feather'
import { Card, CardHeader, Paper, Layout } from '../../kashi/components'
import { getTokenIcon } from 'kashi/functions'
import BentoBoxLogo from 'assets/kashi/bento-symbol.svg'
import BentoBoxImage from 'assets/kashi/bento-illustration.png'

import useFuse from 'sushi-hooks/useFuse'
import useSortableData from 'sushi-hooks/useSortableData'
import BackButton from 'kashi/components/BackButton'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export default function BentoBalances() {
  const history = useHistory()
  const theme = useContext(ThemeContext)

  // todo: include totalDeposits in balances
  const balances = useBentoBalances()
  console.log('balances:', balances)

  const totalDepositsUSD = balances?.reduce((total: number, balance: { amountUSD: number }) => {
    return total + balance.amountUSD
  }, 0)
  //console.log('totalDepositsUSD:', totalDepositsUSD)

  // Search Setup
  const options = { keys: ['symbol', 'name', 'address'], threshold: 0.4 }
  const { result, search, term } = useFuse({
    data: balances && balances.length > 0 ? balances : [],
    options
  })
  const flattenSearchResults = result.map((a: { item: any }) => (a.item ? a.item : a))
  // Sorting Setup
  const { items, requestSort, sortConfig } = useSortableData(flattenSearchResults)

  return (
    <Layout
      left={
        <Card
          className="h-full bg-kashi-card"
          backgroundImage={BentoBoxImage}
          title={'Deposit tokens into BentoBox for all the yields.'}
          description={
            'BentoBox provides extra yield on deposits with flash lending, strategies, and fixed, low-gas transfers among integrated dapps, like Kashi markets.'
          }
        />
      }
    >
      <Card
        className="h-full bg-kashi-card"
        header={
          <CardHeader className="flex justify-between items-center bg-kashi-card-inner">
            <div className="md:hidden">
              <div className="flex float-right items-center">
                <div className="font-semibold">BentoBox Balances</div>
              </div>
            </div>
            <div className="flex w-full justify-between">
              <div className="hidden md:flex items-center">
                <BackButton defaultRoute="/bento" />
                <img src={BentoBoxLogo} className="block w-10 mr-2" />
                <div className="font-semibold text-lg">My BentoBox Balances</div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="relative">
                  <input
                    className="py-3 md:py-3 px-4 rounded-full w-full focus:outline-none"
                    style={{ background: '#161522' }}
                    onChange={e => search(e.target.value)}
                    value={term}
                    placeholder="Search by name, symbol, address"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Search size={16} />
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        }
      >
        <div className="grid gap-4 grid-flow-row auto-rows-max">
          <div className="flex justify-between px-2 pb-4">
            <div className="font-medium text-base text-gray-500">{formattedNum(totalDepositsUSD, true)}</div>
          </div>
          {items &&
            items.length > 0 &&
            items.map((balance: any, i: number) => {
              // todo: remove increment for testing purposes
              return (
                <TokenBalance tokenAddress={balance.address} tokenDetails={balance} key={balance.address + '_' + i} />
              )
            })}
        </div>
      </Card>
    </Layout>
  )
}
interface TokenBalanceProps {
  tokenAddress: string
  tokenDetails: any
}

const TokenBalance = ({ tokenAddress, tokenDetails }: TokenBalanceProps) => {
  const [expand, setExpand] = useState<boolean>(false)
  const tokenBalance = formatFromBalance(tokenDetails?.amount?.value, tokenDetails?.amount?.decimals)
  const { account, chainId } = useActiveWeb3React()
  return (
    <Paper className="bg-kashi-card-inner">
      <div className="p-2 sm:p-4 flex justify-between">
        <div className="flex items-center">
          <a
            href={
              `${
                chainId === ChainId.MAINNET
                  ? 'https://www.etherscan.io/address/'
                  : chainId === ChainId.ROPSTEN
                  ? 'https://ropsten.etherscan.io/address/'
                  : null
              }` + tokenAddress
            }
            target="_blank"
            rel="noreferrer"
          >
            <img src={getTokenIcon(tokenAddress)} className="block w-10 sm:w-14 rounded-lg mr-4" />
          </a>
          <div className="hidden sm:block  font-semibold text-base md:text-lg">{tokenDetails && tokenDetails.name}</div>
        </div>
        <div className="flex items-center">
          <div>
            <div className="font-medium text-base md:text-lg mr-4 text-right">
              {tokenBalance} {tokenDetails && tokenDetails.symbol}{' '}
            </div>
            <div className="font-medium text-gray-600 text-xs md:text-sm mr-4 text-right">
              {formattedNum(tokenDetails.amountUSD, true)}
            </div>
          </div>
          {expand ? (
            <MinusSquare strokeWidth={2} size={24} onClick={() => setExpand(!expand)} />
          ) : (
            <PlusSquare strokeWidth={2} size={24} onClick={() => setExpand(!expand)} />
          )}
        </div>
      </div>
      {expand && (
        <div className="p-2 space-y-4 sm:p-4 sm:flex sm:space-x-2 sm:space-y-0">
          <div className="w-full text-center">
            {/* <div className="pb-2 text-base font-semibold text-gray-400">Deposit to Bento</div> */}
            <TokenDepositPanel
              id={tokenAddress}
              tokenAddress={tokenAddress}
              tokenSymbol={tokenDetails?.symbol}
              cornerRadiusBottomNone={true}
            />
          </div>
          <div className="w-full text-center">
            {/* <div className="pb-2 text-base font-semibold text-gray-400">Withdraw to Wallet</div> */}
            <TokenWithdrawPanel
              id={tokenAddress}
              tokenAddress={tokenAddress}
              tokenSymbol={tokenDetails?.symbol}
              cornerRadiusBottomNone={true}
            />
          </div>
        </div>
      )}
    </Paper>
  )
}
