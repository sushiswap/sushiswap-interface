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

interface TokenProps {
  address: string
  symbol: string
  decimals: number
}

interface SupplyProps {
  collateral: TokenProps
  asset: TokenProps
  pairAddress: string
  healthPercentage: string
  collateralUSD: string
  borrowUSD: string
  max: string
}
export default function Supply({
  collateral,
  asset,
  pairAddress,
  healthPercentage,
  collateralUSD,
  borrowUSD,
  max
}: SupplyProps) {
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
              <div className="text-2xl sm:text-4xl font-semibold">{formattedPercent(healthPercentage)}</div>
            </div>
            <div className="col-span-2 mt-5">
              <div className="flex justify-between">
                <div className="text-xs sm:text-sm text-gray-300">Your collateral:</div>
                <div className="text-xs sm:text-sm text-gray-300">{formattedNum(collateralUSD, true)}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-xs sm:text-sm text-gray-300">Your borrowed:</div>
                <div className="text-xs sm:text-sm text-gray-300">{formattedNum(borrowUSD, true)}</div>
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
            />
            <RemoveCollateral
              tokenAddress={collateral.address}
              tokenSymbol={collateral.symbol}
              pairAddress={pairAddress}
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
              max={max}
            />
            <PayInputPanel tokenAddress={asset.address} tokenSymbol={asset.symbol} pairAddress={pairAddress} />
          </div>
        </AutoColumn>
      </WrapperNoPadding>
    </>
  )
}
