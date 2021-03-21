import React from 'react'

import { WrapperNoPadding } from '../../../../components/swap/styleds'

import { AutoColumn } from '../../../../components/Column'
import QuestionHelper from '../../../../components/QuestionHelper'

import BorrowInputPanel from './BorrowInputPanel'
import PayInputPanel from './PayInputPanel'
import AddCollateral from './AddCollateralInputPanel'
import RemoveCollateral from './RemoveCollateralInputPanel'

import { useKashiPair } from 'context/kashi'
import { formattedNum, formattedPercent } from '../../../../utils'

interface TokenProps {
  address: string
  symbol: string
  decimals: number
}

interface SupplyProps {
  collateral: TokenProps
  asset: TokenProps
  pairAddress: string
  //collateralUSD: string
  //borrowUSD: string
  //maxRemove: string
  //maxBorrow: string
}

export default function Supply({
  collateral,
  asset,
  pairAddress
}: //collateralUSD,
//borrowUSD,
//maxRemove,
//maxBorrow
SupplyProps) {
  const pair = useKashiPair(pairAddress)
  const assetSymbol = pair?.asset.symbol
  const collateralSymbol = pair?.collateral.symbol

  const healthPercentage = pair?.user.health.percentage

  const borrowAPY = pair?.details.apr.borrow

  const userCollateral = pair?.user.collateral.string
  const userCollateralUSD = pair?.user.collateral.usdString
  const userBorrow = pair?.user.borrow.string
  const userBorrowUSD = pair?.user.borrow.usdString

  const maxBorrowUSD = pair?.user.borrow.maxUSD
  const maxBorrow = pair?.user.borrow.max.string

  const interestPerYear = pair?.details.apr.currentInterestPerYear
  //const exchangeRate = pair?.details.rate.current

  console.log('interestPerYear:', interestPerYear)

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
              <div className="text-2xl sm:text-3xl font-semibold">{formattedPercent(healthPercentage)}</div>
            </div>
            <div className="col-span-2 mt-5">
              <div className="flex justify-between">
                <div className="text-xs sm:text-sm text-gray-300">Your Collateral:</div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm text-gray-300">
                    {formattedNum(userCollateral, false)} {collateralSymbol}
                    <span className="text-xs text-gray-500 ml-1">(≈{formattedNum(userCollateralUSD, true)})</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-xs sm:text-sm text-gray-300">Your Borrowed:</div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm text-gray-300">
                    {formattedNum(userBorrow, false)} {assetSymbol}
                    <span className="text-xs text-gray-500 ml-1">(≈{formattedNum(userBorrowUSD, true)})</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-xs sm:text-sm text-gray-300">Left to Borrow:</div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm text-gray-300">
                    {formattedNum(maxBorrow, false)} {assetSymbol}
                    <span className="text-xs text-gray-500 ml-1">(≈{formattedNum(maxBorrowUSD, true)})</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-xs sm:text-sm text-gray-300">Annual Interest:</div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm text-gray-300">{formattedPercent(interestPerYear)}</div>
                </div>
              </div>
              {/* <div className="flex justify-between">
                <div className="text-xs sm:text-sm text-gray-300">Your collateral:</div>
                <div className="text-xs sm:text-sm text-gray-300">{formattedNum(collateralUSD, true)}</div>
              </div> */}
              {/* <div className="flex justify-between">
                <div className="text-xs sm:text-sm text-gray-300">Your borrowed:</div>
                <div className="text-xs sm:text-sm text-gray-300">{formattedNum(borrowUSD, true)}</div>
              </div> */}
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
            <BorrowInputPanel tokenAddress={asset.address} tokenSymbol={asset.symbol} pairAddress={pairAddress} />
            <PayInputPanel tokenAddress={asset.address} tokenSymbol={asset.symbol} pairAddress={pairAddress} />
          </div>
        </AutoColumn>
      </WrapperNoPadding>
    </>
  )
}
