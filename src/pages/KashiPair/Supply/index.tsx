import React from 'react'
import { WrapperNoPadding } from '../../../components/swap/styleds'
import { AutoColumn } from '../../../components/Column'
import QuestionHelper from '../../../components/QuestionHelper'
import SupplyInputPanel from './SupplyInputPanel'
import WithdrawInputPanel from './WithdrawInputPanel'
import useKashiPairHelper from '../../../sushi-hooks/queries/useKashiPairHelper'
import { formattedNum, formattedPercent } from '../../../utils'

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
          <div className="px-2 grid grid-cols-3 gap-2">
            <div className="col-span-1 items-start">
              <div className="flex">
                <div className="text-xs sm:text-sm text-gray-300">Supply APR</div>
                <QuestionHelper text="The amount of collateral you have supplied for this Kashi Pair. The dollar value is estimated using the Sushiswap Oracle." />
              </div>
              <div className="text-2xl sm:text-4xl font-semibold">{formattedPercent('125')}</div>
            </div>
            <div className="col-span-2 mt-5">
              <div className="flex justify-between">
                <div className="text-xs sm:text-sm text-gray-300">Market Supply:</div>
                <div className="text-xs sm:text-sm text-gray-300">
                  {formattedNum(kashi?.pair?.[0]?.details.total.asset.usdString, true)}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-xs sm:text-sm text-gray-300">Your Supply:</div>
                <div className="text-xs sm:text-sm text-gray-300">
                  {formattedNum(kashi?.pair?.[0]?.user.asset.usdString, true)}
                </div>
              </div>
            </div>
          </div>
          <div>
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
