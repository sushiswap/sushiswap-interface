import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import { DarkCard, BaseCard } from '../../components/Card'
import { transparentize } from 'polished'
import TokenDepositPanel from './TokenDepositPanel'
import TokenWithdrawPanel from './TokenWithdrawPanel'
import { useActiveWeb3React } from '../../hooks'
import useBentoBalances from '../../sushi-hooks/queries/useBentoBalances'
import { formatFromBalance, formattedNum } from '../../utils'
import { Search, PlusSquare, MinusSquare, ChevronLeft } from 'react-feather'
import { InfoCard, FixedScrollable, Layout } from '../../kashi/components'
import getTokenIcon from '../../sushi-hooks/queries/getTokenIcons'
import BentoBoxLogo from '../../assets/kashi/bento-symbol.svg'
import BentoBoxImage from '../../assets/kashi/bento-illustration.png'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

const PageWrapper = styled(AutoColumn)`
  max-width: 1280px;
  width: 100%;
`

const StyledBaseCard = styled(BaseCard)`
  border: none;
  background: ${({ theme }) => theme.baseCard};
  position: relative;
  overflow: hidden;
  border-radius: 0 0 15px 15px;
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
        <Layout
          left={
            <InfoCard
              backgroundImage={BentoBoxImage}
              title={'Deposit tokens into BentoBox for all the yields.'}
              description={
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
              }
            />
          }
        >
          <AutoColumn gap="md" justify="center">
            <AutoColumn
              gap="md"
              style={{
                width: '100%',
                paddingTop: '1rem',
                background: `${theme.mediumDarkPurple}`,
                borderRadius: '12px 12px 12px 12px'
              }}
            >
              <div className="px-6 pb-2 md:px-2 md:pb-4 flex md:hidden justify-between">
                <div className="flex float-right items-center">
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
                    className="mr-4 p-2 rounded-full"
                    style={{ background: theme.baseCard }}
                  >
                    <ChevronLeft strokeWidth={2} size={24} />
                  </button>
                  <img src={BentoBoxLogo} className="w-10 mr-2" />
                  <div className="font-semibold text-lg">My Bento Balances</div>
                </div>
                <div className="px-4 w-full md:w-1/2">
                  <div className="relative">
                    <input
                      className="py-3 md:py-3 px-4 rounded-full w-full focus:outline-none"
                      style={{ background: theme.baseCard }}
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

              <StyledBaseCard padding={'0px'}>
                <div className="p-2 sm:p-4">
                  <div className="flex justify-between px-2 pb-4">
                    <div className="font-medium text-base text-gray-500">Total Deposits:</div>
                    <div className="font-medium text-base text-gray-500">≈ {formattedNum(totalDepositsUSD, true)}</div>
                  </div>
                  <FixedScrollable>
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
                  </FixedScrollable>
                </div>
              </StyledBaseCard>
            </AutoColumn>
          </AutoColumn>
        </Layout>
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
    <DarkCard padding={'0px'} marginBottom={'10px'}>
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
    </DarkCard>
  )
}
