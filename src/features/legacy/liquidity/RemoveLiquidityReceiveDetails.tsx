import { Currency, currencyEquals, NATIVE, WNATIVE } from '@sushiswap/core-sdk'
import { AutoColumn } from 'app/components/Column'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { RowBetween } from 'app/components/Row'
import { currencyId } from 'app/functions/currency'
import { useActiveWeb3React } from 'app/services/web3'
import Link from 'next/link'
import React from 'react'

interface RemoveLiquidityReceiveDetailsProps {
  currencyA?: Currency
  amountA: string
  currencyB?: Currency
  amountB: string
  hasWETH: boolean
  hasETH: boolean
  id: string
}

export default function RemoveLiquidityReceiveDetails({
  currencyA,
  amountA,
  currencyB,
  amountB,
  hasWETH,
  hasETH,
  id,
}: RemoveLiquidityReceiveDetailsProps) {
  const { chainId } = useActiveWeb3React()
  if (!chainId || !currencyA || !currencyB) throw new Error('missing dependencies')
  return (
    <div id={id} className="p-5 rounded bg-dark-800">
      <div className="flex flex-col justify-between space-y-3 sm:space-y-0 sm:flex-row">
        <div className="w-full text-white sm:w-2/5" style={{ margin: 'auto 0px' }}>
          <AutoColumn>
            <div>You Will Receive:</div>
            <RowBetween className="text-sm">
              {hasWETH ? (
                <Link href={`/remove/${currencyId(currencyA)}/${currencyId(currencyB)}`}>
                  <a>Receive {WNATIVE[chainId].symbol}</a>
                </Link>
              ) : hasETH ? (
                <Link
                  href={`/remove/${
                    currencyA && currencyEquals(currencyA, WNATIVE[chainId])
                      ? // @ts-ignore TYPE NEEDS FIXING
                        NATIVE[chainId].symbol
                      : currencyId(currencyA)
                  }/${
                    currencyB && currencyEquals(currencyB, WNATIVE[chainId])
                      ? // @ts-ignore TYPE NEEDS FIXING
                        NATIVE[chainId].symbol
                      : currencyId(currencyB)
                  }`}
                >
                  {/*@ts-ignore TYPE NEEDS FIXING*/}
                  <a>Receive {NATIVE[chainId].symbol}</a>
                </Link>
              ) : null}
            </RowBetween>
          </AutoColumn>
        </div>
        {/* <RowBetween className="space-x-6"> */}
        <div className="flex flex-col space-y-3 md:flex-row md:space-x-6 md:space-y-0">
          <div className="flex flex-row items-center w-full p-3 space-x-4 rounded bg-dark-900">
            <CurrencyLogo currency={currencyA} size="46px" style={{ marginRight: '12px' }} />
            <AutoColumn>
              <div className="text-white">{amountA}</div>
              <div className="text-sm">{currencyA?.symbol}</div>
            </AutoColumn>
          </div>
          <div className="flex flex-row items-center w-full p-3 space-x-4 rounded bg-dark-900">
            <CurrencyLogo currency={currencyB} size="46px" style={{ marginRight: '12px' }} />
            <AutoColumn>
              <div className="text-white">{amountB}</div>
              <div className="text-sm">{currencyB?.symbol}</div>
            </AutoColumn>
          </div>
        </div>
      </div>
    </div>
  )
}
