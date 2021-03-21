import React, { useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from '../../theme'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import { DarkCard } from '../../components/Card'
import TokenDepositPanel from './TokenDepositPanel'
import TokenWithdrawPanel from './TokenWithdrawPanel'
import useBentoBalances from '../../sushi-hooks/queries/useBentoBalances'
import { formatFromBalance } from '../../utils'
import getTokenIcon from '../../sushi-hooks/queries/getTokenIcons'
import BentoBoxLogo from '../../assets/kashi/bento-symbol.svg'
import { formattedNum } from '../../utils'
import { PlusSquare, MinusSquare } from 'react-feather'
import { Card, CardHeader } from '../Kashi/components'
import Layout from '../Kashi/components/Layout'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

const PageWrapper = styled.div`
  height: 100%;
  width: 100%;
  max-width: 1280px;
`

export default function BentoBalances() {
  const theme = useContext(ThemeContext)
  const balances = useBentoBalances()
  const totalDepositsUSD = balances?.reduce((total: number, balance: { amountUSD: number }) => {
    return total + balance.amountUSD
  }, 0)
  return (
    <>
      <PageWrapper>
        <Layout>
          <AutoColumn gap="md" justify="center">
            <AutoColumn gap="md" style={{ width: '100%' }}>
              <Card>
                <CardHeader>
                  <RowBetween>
                    <div className="flex items-center">
                      <img src={BentoBoxLogo} className="w-12 mr-2" />
                      <TYPE.extraLargeHeader
                        color={theme.highEmphesisText}
                        fontSize={36}
                        fontWeight={700}
                        lineHeight={1}
                      >
                        My Bento Balances
                      </TYPE.extraLargeHeader>
                    </div>
                    <div className="flex items-center">
                      <TYPE.body color={theme.mediumEmphesisText} fontSize={18} fontWeight={700}>
                        TOTAL ASSET VALUE:
                      </TYPE.body>
                      <TYPE.body
                        color={theme.highEmphesisText}
                        fontSize={24}
                        fontWeight={700}
                        style={{ marginLeft: 8 }}
                      >
                        ≈{formattedNum(totalDepositsUSD, true)}
                      </TYPE.body>
                    </div>
                  </RowBetween>
                </CardHeader>
                <div style={{ padding: '32px' }}>
                  <AutoColumn gap="10px">
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
                  </AutoColumn>
                </div>
              </Card>
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
        <div className="p-2 space-y-4 sm:p-4 sm:flex sm:space-x-2 sm:space-y-0">
          <div className="w-full text-center">
            <div className="pb-2 text-base font-semibold text-gray-400">Deposit to Bento</div>
            <TokenDepositPanel
              id={tokenAddress}
              tokenAddress={tokenAddress}
              tokenSymbol={tokenDetails?.symbol}
              cornerRadiusBottomNone={true}
            />
          </div>
          <div className="w-full text-center">
            <div className="pb-2 text-base font-semibold text-gray-400">Withdraw to Wallet</div>
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
