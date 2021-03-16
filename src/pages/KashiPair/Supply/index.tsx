import React from 'react'
import { WrapperNoPadding } from '../../../components/swap/styleds'
import { AutoColumn } from '../../../components/Column'
import QuestionHelper from '../../../components/QuestionHelper'
import SupplyInputPanel from './SupplyInputPanel'
import WithdrawInputPanel from './WithdrawInputPanel'
import { useKashiPair } from '../../../contexts/kashi'
import { formattedNum, formattedPercent } from '../../../utils'

interface SupplyProps {
  tokenAddress: string
  tokenSymbol: string
  pairAddress: string
}

export default function Supply({ tokenAddress, tokenSymbol, pairAddress }: SupplyProps) {
  const kashi = useKashiPair(pairAddress)
  console.log('pairDetails:', kashi)

  const assetSymbol = kashi?.pair?.[0].asset.symbol
  const supplyAPY = kashi?.pair?.[0]?.details.apr.asset

  const marketSupply = kashi?.pair?.[0].details.total.asset.string
  const marketSupplyUSD = kashi?.pair?.[0].details.total.asset.usdString

  const userSupply = kashi?.pair?.[0]?.user.asset.string
  const userSupplyUSD = kashi?.pair?.[0]?.user.asset.usdString

  return (
    <>
      <WrapperNoPadding id="stake-page">
        <AutoColumn gap="sm">
          <div className="px-2 grid grid-cols-3 gap-2">
            <div className="col-span-1 items-start">
              <div className="flex">
                <div className="text-xs sm:text-sm text-gray-300">Supply APR</div>
                <QuestionHelper text="The amount of asset you have supplied to this Kashi Pair. The dollar value is estimated using the Sushiswap Oracle." />
              </div>
              <div className="text-2xl sm:text-4xl font-semibold">{formattedPercent(supplyAPY)}</div>
            </div>
            <div className="col-span-2">
              <div className="flex justify-between">
                <div className="text-xs sm:text-sm text-gray-300">Market Supply:</div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm text-gray-300">
                    {formattedNum(marketSupply, false)} {assetSymbol}
                  </div>
                  <div className="text-xs text-gray-500">≈ {formattedNum(marketSupplyUSD, true)}</div>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-xs sm:text-sm text-gray-300">Your Supply:</div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm text-gray-300">
                    {formattedNum(userSupply, false)} {assetSymbol}
                  </div>
                  <div className="text-xs text-gray-500">≈ {formattedNum(userSupplyUSD, true)}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-2">
            <SupplyInputPanel
              id="supply-collateral-token"
              tokenAddress={tokenAddress}
              tokenSymbol={tokenSymbol}
              pairAddress={pairAddress}
            />
            <WithdrawInputPanel
              id="withdraw-collateral-token"
              tokenAddress={tokenAddress}
              tokenSymbol={tokenSymbol}
              pairAddress={pairAddress}
            />
          </div>
        </AutoColumn>
      </WrapperNoPadding>
    </>
  )
}
