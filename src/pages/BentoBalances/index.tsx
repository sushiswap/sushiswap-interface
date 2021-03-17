import React, { useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { ExternalLink, TYPE, HideSmall } from '../../theme'
import { Text } from 'rebass'

import { RowBetween, RowFixed } from '../../components/Row'
import { ButtonEmpty } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { CardSection, DataCard } from '../../components/earn/styled'
import { DarkCard, BaseCard } from '../../components/Card'
import { transparentize } from 'polished'

import TokenDepositPanel from './TokenDepositPanel'
import TokenWithdrawPanel from './TokenWithdrawPanel'

import { useActiveWeb3React } from '../../hooks'
import useBentoBalances from '../../sushi-hooks/queries/useBentoBalances'
//import useBentoBalance from '../../sushi-hooks/queries/useBentoBalance'
import { formatFromBalance } from '../../utils'

//import useTokenInfo from '../../sushi-hooks/queries/useTokenInfo'
import getTokenIcon from '../../sushi-hooks/queries/getTokenIcons'

import BentoBoxLogo from '../../assets/kashi/bento-symbol.svg'

import { formattedNum } from '../../utils'

import { Search, PlusSquare, MinusSquare, ChevronLeft } from 'react-feather'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const StyledBaseCard = styled(BaseCard)`
border: none
background: ${({ theme }) => transparentize(0.6, theme.bg1)};
position: relative;
overflow: hidden;
`

export default function BentoBalances() {
  const history = useHistory()
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  // todo: include totalDeposits in balances
  const balances = useBentoBalances()
  //console.log('balances:', balances)

  const totalDepositsUSD = balances?.reduce((total: number, balance: { amountUSD: number }) => {
    return total + balance.amountUSD
  }, 0)
  //console.log('totalDepositsUSD:', totalDepositsUSD)

  return (
    <>
      <PageWrapper>
        <AutoColumn gap="md" justify="center">
          <AutoColumn gap="md" style={{ width: '100%' }}>
            <div className="flex md:hidden pb-4 justify-between">
              <button
                onClick={() => {
                  if (history.length < 3) {
                    history.push('/bento')
                  } else {
                    history.goBack()
                  }
                }}
                className="mr-2"
              >
                <ChevronLeft strokeWidth={2} size={24} />
              </button>
              <div className="flex float-right">
                <img src={BentoBoxLogo} className="w-10 mr-2" />
                <div className="font-semibold">My Bento Balances</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="hidden md:flex ml-4 items-center">
                <button
                  onClick={() => {
                    if (history.length < 3) {
                      history.push('/bento')
                    } else {
                      history.goBack()
                    }
                  }}
                  className="mr-2"
                >
                  <ChevronLeft strokeWidth={2} size={24} />
                </button>
                <img src={BentoBoxLogo} className="w-10 mr-2" />
                <div className="font-semibold text-lg">My Bento Balances</div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="relative">
                  <input
                    className="py-2 px-4 rounded-full w-full focus:outline-none"
                    style={{ background: `${transparentize(0.6, theme.bg1)}` }}
                    //onChange={e => search(e.target.value)}
                    //value={term}
                    placeholder="Search by name, symbol, address"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Search size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* List of Tools */}
            <StyledBaseCard padding={'0px'}>
              <div className="p-2 sm:p-4">
                <div className="flex justify-between px-2 pb-4">
                  <div className="font-medium text-base text-gray-500">Total Deposits:</div>
                  <div className="font-medium text-base text-gray-500">≈ {formattedNum(totalDepositsUSD, true)}</div>
                </div>
                {balances &&
                  balances.map((balance: any, i: number) => {
                    // todo: remove increment for testing purposes
                    return (
                      <TokenBalance
                        tokenAddress={balance.address}
                        tokenDetails={balance}
                        key={balance.address + '_' + i}
                      />
                    )
                  })}
              </div>
            </StyledBaseCard>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}
interface TokenBalanceProps {
  tokenAddress: string
  tokenDetails: any
}

const TokenBalance = ({ tokenAddress, tokenDetails }: TokenBalanceProps) => {
  const [expand, setExpand] = useState<boolean>(false)
  //const tokenDetails = useTokenInfo(tokenAddress)
  //const tokenBalanceBigInt = useBentoBalance(tokenAddress)
  //const tokenBalance = formatFromBalance(tokenBalanceBigInt?.value, tokenBalanceBigInt?.decimals)
  //console.log('tokenDetails:', tokenDetails)
  const tokenBalance = formatFromBalance(tokenDetails?.amount?.value, tokenDetails?.amount?.decimals)

  return (
    <DarkCard padding={'0px'} marginBottom={'5px'}>
      <div className="p-2 sm:p-4 flex justify-between">
        <div className="flex items-center">
          <img src={getTokenIcon(tokenAddress)} className="w-10 sm:w-14 rounded-lg mr-4" />
          <div className="hidden sm:block  font-semibold text-base md:text-lg">{tokenDetails && tokenDetails.name}</div>
        </div>
        <div className="flex items-center">
          <div>
            <div className="font-medium text-base md:text-lg mr-4 text-right">
              {tokenBalance} {tokenDetails && tokenDetails.symbol}{' '}
            </div>
            <div className="font-medium text-gray-600 text-xs md:text-sm mr-4 text-right">
              ≈ {formattedNum(tokenDetails.amountUSD, true)}
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
        <div className="p-2 space-y-2 sm:p-4 sm:flex sm:space-x-2 sm:space-y-0">
          <div className="w-full text-center">
            <div className="pb-2 text-lg font-semibold text-gray-400">Deposit to Bento</div>
            <TokenDepositPanel
              id={tokenAddress}
              tokenAddress={tokenAddress}
              tokenSymbol={tokenDetails?.symbol}
              cornerRadiusBottomNone={true}
            />
          </div>
          <div className="w-full text-center">
            <div className="pb-2 text-lg font-semibold text-gray-400">Withdraw to Wallet</div>
            <TokenWithdrawPanel
              id={tokenAddress}
              tokenAddress={tokenAddress}
              tokenSymbol={tokenDetails?.symbol}
              cornerRadiusBottomNone={true}
            />
          </div>
        </div>
      )}
    </DarkCard>
  )
}
