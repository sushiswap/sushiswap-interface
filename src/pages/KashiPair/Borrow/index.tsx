import React from 'react'
import styled from 'styled-components'

import { WrapperNoPadding } from '../../../components/swap/styleds'

import { AutoColumn } from '../../../components/Column'
import QuestionHelper from '../../../components/QuestionHelper'

import BorrowInputPanel from './BorrowInputPanel'
import PayInputPanel from './PayInputPanel'
import AddCollateral from './AddCollateralInputPanel'
import RemoveCollateral from './RemoveCollateralInputPanel'

import { formattedNum, formattedPercent } from '../../../utils'

export const PluginBody = styled.div`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.bg1};
`

interface TokenProps {
  address: string
  symbol: string
  decimals: number
}

interface SupplyProps {
  collateral: TokenProps
  asset: TokenProps
  pairAddress: string
}
export default function Supply({ collateral, asset, pairAddress }: SupplyProps) {
  return (
    <>
      <WrapperNoPadding id="stake-page">
        <AutoColumn gap="sm">
          <div className="px-2 grid grid-cols-3 gap-2">
            <div className="col-span-1 items-start">
              <div className="flex">
                <div className="text-xs sm:text-sm text-gray-300">Borrow Used</div>
                <QuestionHelper text="The amount of collateral you have supplied for this Kashi Pair. The dollar value is estimated using the Sushiswap Oracle." />
              </div>
              <div className="text-2xl sm:text-4xl font-semibold">{formattedPercent('75')}</div>
            </div>
            <div className="col-span-2 mt-5">
              <div className="flex justify-between">
                <div className="text-xs sm:text-sm text-gray-300">Your collateral:</div>
                <div className="text-xs sm:text-sm text-gray-300">{formattedNum('500', true)}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-xs sm:text-sm text-gray-300">Your borrowed:</div>
                <div className="text-xs sm:text-sm text-gray-300">{formattedNum('500', true)}</div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center px-1 pt-2">
            <div className="text-sm text-gray-300">Collateral</div>
          </div>
          <div>
            <AddCollateral
              tokenAddress={collateral.address}
              tokenSymbol={collateral.symbol}
              pairAddress={pairAddress}
              disableCurrencySelect={true}
              id="supply-collateral-token"
              cornerRadiusBottomNone={true}
            />
            <RemoveCollateral
              tokenAddress={collateral.address}
              tokenSymbol={collateral.symbol}
              pairAddress={pairAddress}
              disableCurrencySelect={true}
              id="withdraw-collateral-token"
              cornerRadiusTopNone={true}
            />
          </div>
          <div className="flex justify-between items-center px-1">
            <div className="text-sm text-gray-300">Borrow</div>
          </div>
          <div>
            <BorrowInputPanel
              tokenAddress={asset.address}
              tokenSymbol={asset.symbol}
              tokenDecimals={asset.decimals}
              pairAddress={pairAddress}
              disableCurrencySelect={true}
              id="supply-collateral-token"
              cornerRadiusBottomNone={true}
            />
            <PayInputPanel
              tokenAddress={asset.address}
              tokenSymbol={asset.symbol}
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
