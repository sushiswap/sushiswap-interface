import React from 'react'
import styled from 'styled-components'

import { WrapperNoPadding } from '../../../components/swap/styleds'

import { AutoColumn } from '../../../components/Column'
import QuestionHelper from '../../../components/QuestionHelper'

import BorrowInputPanel from './BorrowInputPanel'
import PayInputPanel from './PayInputPanel'
import AddCollateral from './AddCollateralInputPanel'
import RemoveCollateral from './RemoveCollateralInputPanel'

export const PluginBody = styled.div`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.bg1};
`

interface TokenProps {
  address: string
  symbol: string
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
          <div className="px-2">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-300">Borrow Limit</div>
              <div className="flex">
                <div className="text-sm text-gray-300">$75</div>
                <QuestionHelper text="The amount of collateral you have supplied for this Kashi Pair. The dollar value is estimated using the Sushiswap Oracle." />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-300">Borrow Limit Used</div>
              <div className="flex">
                <div className="text-sm text-gray-300">75%</div>
                <QuestionHelper text="The amount of collateral you have supplied for this Kashi Pair. The dollar value is estimated using the Sushiswap Oracle." />
              </div>
            </div>
            <div className="flex justify-between items-center pb-2">
              <div className="text-sm text-gray-300">Supply APR</div>
              <QuestionHelper text="The amount of collateral you have supplied for this Kashi Pair. The dollar value is estimated using the Sushiswap Oracle." />
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-300">Collateral</div>
              <QuestionHelper text="The amount of collateral you have supplied for this Kashi Pair. The dollar value is estimated using the Sushiswap Oracle." />
            </div>
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
