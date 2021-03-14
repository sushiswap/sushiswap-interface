import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { WrapperNoPadding } from '../../../components/swap/styleds'

import { AutoColumn } from '../../../components/Column'
import QuestionHelper from '../../../components/QuestionHelper'
import SupplyInputPanel from './SupplyInputPanel'
import WithdrawInputPanel from './WithdrawInputPanel'

import useKashiPairHelper from '../../../sushi-hooks/queries/useKashiPairHelper'
import { formattedNum } from '../../../utils'

export const PluginBody = styled.div`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.bg1};
`

interface SupplyProps {
  tokenAddress: string
  tokenSymbol: string
  pairAddress: string
}
export default function Supply({ tokenAddress, tokenSymbol, pairAddress }: SupplyProps) {
  const kashi = useKashiPairHelper(pairAddress)
  console.log('pairDetails:', kashi)

  return (
    <>
      <WrapperNoPadding id="stake-page">
        <AutoColumn gap="sm">
          <div className="px-2">
            <div className="flex"></div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-300">Total Market Supplied</div>
              <div className="flex">
                <div className="text-sm text-gray-300">
                  {formattedNum(kashi?.pair?.[0]?.details.total.asset.usdString, true)}
                </div>
                <QuestionHelper text="The amount of collateral you have supplied for this Kashi Pair. The dollar value is estimated using the Sushiswap Oracle." />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-300">Your Total Supplied</div>
              <div className="flex">
                <div className="text-sm text-gray-300">
                  {formattedNum(kashi?.pair?.[0]?.user.asset.usdString, true)}
                </div>
                <QuestionHelper text="The amount of collateral you have supplied for this Kashi Pair. The dollar value is estimated using the Sushiswap Oracle." />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-300">Supply APR</div>
              <QuestionHelper text="The amount of collateral you have supplied for this Kashi Pair. The dollar value is estimated using the Sushiswap Oracle." />
            </div>
          </div>
          <div>
            <SupplyInputPanel
              tokenAddress={tokenAddress}
              tokenSymbol={tokenSymbol}
              pairAddress={pairAddress}
              disableCurrencySelect={true}
              id="supply-collateral-token"
              cornerRadiusBottomNone={true}
            />
            <WithdrawInputPanel
              tokenAddress={tokenAddress}
              tokenSymbol={tokenSymbol}
              pairAddress={pairAddress}
              disableCurrencySelect={true}
              id="withdraw-collateral-token"
              cornerRadiusTopNone={true}
            />
          </div>
        </AutoColumn>
      </WrapperNoPadding>
    </>
  )
}
