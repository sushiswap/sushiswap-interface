import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { ChainId } from '@sushiswap/sdk'
import { RowBetween } from '../../components/Row'
import TokenDepositPanel from './TokenDepositPanel'
import TokenWithdrawPanel from './TokenWithdrawPanel'
import { useActiveWeb3React } from 'hooks'
import useBentoBalances, { BentoBalance } from 'sushi-hooks/useBentoBalances'
import { formatFromBalance, formattedNum } from '../../utils'
import { PlusSquare, MinusSquare, ChevronLeft } from 'react-feather'
import { Card, CardHeader, Paper, Layout, Search } from '../../kashi/components'
import { getTokenIcon } from 'kashi/functions'
import BentoBoxLogo from 'assets/kashi/bento-symbol.svg'
import BentoBoxImage from 'assets/kashi/bento-illustration.png'
import useFuse from 'sushi-hooks/useFuse'
import useSortableData from 'sushi-hooks/useSortableData'
import { BackButton } from 'kashi/components'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export default function BentoBalances(): JSX.Element {
  // todo: include totalDeposits in balances
  const balances = useBentoBalances()
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
          className="h-full bg-dark-900"
          backgroundImage={BentoBoxImage}
          title={'Deposit tokens into BentoBox for all the yields.'}
          description={
            'BentoBox provides extra yield on deposits with flash lending, strategies, and fixed, low-gas transfers among integrated dapps, like Kashi markets.'
          }
        />
      }
    >
      <Card
        className="h-full bg-dark-900"
        header={
          <CardHeader className="flex justify-between items-center bg-dark-900">
            <div className="md:hidden">
              <div className="flex float-right items-center">
                <div className="font-semibold">My BentoBox</div>
              </div>
            </div>
            <div className="flex w-full justify-between">
              <div className="hidden md:flex items-center">
                <BackButton defaultRoute="/bento" />
                <img alt="" src={BentoBoxLogo} className="block w-10 mr-2" />
                <div className="text-lg mr-2">My BentoBox</div>
                <div className="text-lg text-gray-500">
                  {formattedNum(
                    balances?.reduce((previousValue, currentValue) => {
                      return previousValue + Number(currentValue.amountUSD)
                    }, 0),
                    true
                  )}
                </div>
              </div>
              <Search search={search} term={term} />
            </div>
          </CardHeader>
        }
      >
        <div className="grid gap-4 grid-flow-row auto-rows-max">
          <div className="px-4 grid grid-cols-3 text-sm font-semibold text-gray-500 select-none">
            <div>Token</div>
            <div className="text-right">Wallet</div>
            <div className="text-right">BentoBox</div>
          </div>
          {items &&
            items.length > 0 &&
            items.map((balance: BentoBalance, i: number) => {
              // todo: remove increment for testing purposes
              return <TokenBalance key={balance.address + '_' + i} balance={balance} />
            })}
        </div>
      </Card>
    </Layout>
  )
}

const TokenBalance = ({ balance }: { balance: BentoBalance }) => {
  const [expand, setExpand] = useState<boolean>(false)
  const walletBalance = formatFromBalance(balance?.balance, balance?.amount?.decimals)
  const bentoBalance = formatFromBalance(balance?.bentoBalance, balance?.amount?.decimals)
  const { chainId } = useActiveWeb3React()
  return (
    <Paper className="bg-dark-800">
      <div
        className="grid grid-cols-3 py-4 px-4 cursor-pointer select-none rounded text-sm font-semibold"
        onClick={() => setExpand(!expand)}
      >
        <div className="flex items-center">
          <a
            href={
              `${
                chainId === ChainId.MAINNET
                  ? 'https://www.etherscan.io/address/'
                  : chainId === ChainId.ROPSTEN
                  ? 'https://ropsten.etherscan.io/address/'
                  : null
              }` + balance.address
            }
            target="_blank"
            rel="noreferrer"
          >
            <img alt="" src={getTokenIcon(balance.address)} className="block w-10 sm:w-14 rounded-lg mr-4" />
          </a>
          <div className="hidden sm:block">{balance && balance.symbol}</div>
        </div>
        <div className="flex justify-end items-center">
          <div>
            <div className="text-right">{walletBalance} </div>
            <div className="text-gray-500 text-right">{formattedNum(balance.amountUSD, true)}</div>
          </div>
        </div>
        <div className="flex justify-end items-center">
          <div>
            <div className="text-right">{bentoBalance} </div>
            <div className="text-gray-500 text-right">{formattedNum(balance.amountUSD, true)}</div>
          </div>
        </div>
        {/* <div className="flex items-center">
          {expand ? <MinusSquare strokeWidth={2} size={24} /> : <PlusSquare strokeWidth={2} size={24} />}
        </div> */}
      </div>
      {expand && (
        <div className="p-2 space-y-4 sm:p-4 sm:flex sm:space-x-2 sm:space-y-0">
          <div className="w-full text-center">
            {/* <div className="pb-2 text-base font-semibold text-gray-400">Deposit to Bento</div> */}
            <TokenDepositPanel
              id={balance.address}
              tokenAddress={balance.address}
              tokenSymbol={balance.symbol}
              cornerRadiusBottomNone={true}
            />
          </div>
          <div className="w-full text-center">
            {/* <div className="pb-2 text-base font-semibold text-gray-400">Withdraw to Wallet</div> */}
            <TokenWithdrawPanel
              id={balance.address}
              tokenAddress={balance.address}
              tokenSymbol={balance.symbol}
              cornerRadiusBottomNone={true}
            />
          </div>
        </div>
      )}
    </Paper>
  )
}
